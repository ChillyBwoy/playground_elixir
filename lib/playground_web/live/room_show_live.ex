defmodule PlaygroundWeb.RoomShowLive do
  use PlaygroundWeb, :live_view

  alias Playground.PubSub
  alias Playground.Auth
  alias Playground.Auth.User
  alias Playground.Chat
  alias Playground.Chat.Message
  alias Playground.Repo

  @presence "room:presence"

  @impl true
  def mount(_params, %{"user_token" => user_token}, %{assigns: %{ current_user: %User{} }} = socket) do
    {:ok,
      socket
        |> assign(:user_token, user_token)}
  end

  @impl true
  def handle_params(%{"id" => id}, _uri, socket) do
    room = Chat.get_room!(id) |> Repo.preload([:owner])

    {:noreply,
     socket
      |> assign(:room, room)
      |> assign(:messages, fetch_messages(room.id))}
  end

  @impl true
  def handle_info({:message_created, %Message{} = message}, socket) do
    {:noreply,
      socket
        |> assign(:messages, [message | socket.assigns.messages])
        |> put_flash(:info, "Message created successfully")}
  end

  defp fetch_messages(room_id) do
    messages = Chat.get_messages_for_room(room_id)

    list_of_user_ids =
      messages
        |> Enum.map(& &1.user_id)
        |> MapSet.new()
        |> Enum.to_list()

    users = Auth.get_user_map_by_ids(list_of_user_ids)

    Enum.map(messages, fn message ->
      Map.put(message, :author, users[message.user_id])
    end)
  end
end
