defmodule PlaygroundWeb.RoomShowLive do
  use PlaygroundWeb, :live_view

  alias Playground.Auth.User
  alias Playground.Chat
  alias Playground.Chat.{Room, Message}
  alias Playground.Repo

  alias PlaygroundWeb.Presence

  @presence "presence:room"

  @impl true
  def mount(
        _params,
        %{"user_token" => user_token},
        %{assigns: %{current_user: %User{} = current_user}} = socket
      ) do
    if connected?(socket) do
      Presence.track_user(@presence, current_user.id)

      Phoenix.PubSub.subscribe(Playground.PubSub, @presence)
    end

    {:ok,
     socket
     |> assign(:current_user, current_user)
     |> assign(:user_token, user_token)
     |> assign(:users, %{})
     |> handle_joins(Presence.list(@presence))}
  end

  @impl true
  def handle_params(%{"id" => id}, _uri, socket) do
    case Chat.get_room(id) |> Repo.preload([:owner, :canvases, messages: [:author]]) do
      %Room{} = room ->
        {:noreply,
         socket
         |> assign(:room, room)
         |> assign(:canvas, room.canvases |> Enum.at(0))
         |> assign(:messages, room.messages)}

      nil ->
        raise PlaygroundWeb.Errors.NotFoundError, "room not found"
    end
  end

  @impl true
  def handle_info({:message_created, %Message{} = message}, socket) do
    {:noreply,
     socket
     |> assign(:messages, socket.assigns.messages |> Enum.concat([message]))
     |> put_flash(:info, "Message created successfully")}
  end

  @impl true
  def handle_info(
        %Phoenix.Socket.Broadcast{event: "presence_diff", payload: diff},
        socket
      ) do
    {:noreply,
     socket
     |> handle_leaves(diff.leaves)
     |> handle_joins(diff.joins)}
  end

  @impl true
  def handle_info(_msg, socket) do
    # Ignore other messages.
    {:noreply, socket}
  end

  defp handle_joins(socket, joins) do
    Enum.reduce(joins, socket, fn {user_id, data}, socket ->
      assign(socket, :users, Map.put(socket.assigns.users, user_id, data))
    end)
  end

  defp handle_leaves(socket, leaves) do
    Enum.reduce(leaves, socket, fn {user_id, _}, socket ->
      assign(socket, :users, Map.delete(socket.assigns.users, user_id))
    end)
  end
end
