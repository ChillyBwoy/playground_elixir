defmodule PlaygroundWeb.RoomShowLive do
  use PlaygroundWeb, :live_view

  alias Playground.Auth.User
  alias Playground.Chat
  alias Playground.Chat.{Room,Message}
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
        # |> assign(:messages, [message | socket.assigns.messages])
        |> assign(:messages, socket.assigns.messages |> Enum.concat([message]))
        |> put_flash(:info, "Message created successfully")}
  end
end
