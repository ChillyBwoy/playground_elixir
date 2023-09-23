defmodule PlaygroundWeb.RoomShowLive do
  use PlaygroundWeb, :live_view

  alias Playground.Auth.User
  alias Playground.Chat
  alias Playground.Chat.{Room, Message}
  alias Playground.Repo

  alias PlaygroundWeb.Presence

  @impl true
  def mount(_params, _session, socket) do
    {:ok, socket}
  end

  @impl true
  def handle_params(
        %{"id" => id},
        _uri,
        %{assigns: %{current_user: %User{} = current_user}} = socket
      ) do
    topic = "presence:room:#{id}"

    if connected?(socket) do
      Presence.track_user(topic, current_user.id)
      Phoenix.PubSub.subscribe(Playground.PubSub, topic)
    end

    case Chat.get_room(id) |> Repo.preload([:owner, :canvases, messages: [:author]]) do
      %Room{} = room ->
        {
          :noreply,
          socket
          |> assign(:room, room)
          |> assign(:canvas, room.canvases |> Enum.at(0))
          |> assign(:messages, room.messages)
          |> assign(:users, %{} |> map_joins(Presence.list(topic)))
        }

      nil ->
        raise PlaygroundWeb.Errors.NotFoundError, "room not found"
    end
  end

  @impl true
  def handle_info({:message_created, %Message{} = message}, socket) do
    new_message = message |> Repo.preload([:author])

    {:noreply,
     socket
     |> assign(:messages, socket.assigns.messages |> Enum.concat([new_message]))}
  end

  @impl true
  def handle_info(
        %Phoenix.Socket.Broadcast{
          event: "presence_diff",
          payload: %{joins: joins, leaves: leaves}
        },
        %{assigns: %{users: users}} = socket
      ) do
    {:noreply,
     socket
     |> assign(:users, users |> map_joins(joins) |> map_leaves(leaves))}
  end

  @impl true
  def handle_info(_msg, socket) do
    # Ignore other messages.
    {:noreply, socket}
  end

  defp map_joins(%{} = target, joins) do
    Enum.reduce(joins, target, fn {user_id, data}, target ->
      Map.put(target, user_id, data)
    end)
  end

  defp map_leaves(%{} = target, leaves) do
    Enum.reduce(leaves, target, fn {user_id, _}, target ->
      Map.delete(target, user_id)
    end)
  end
end
