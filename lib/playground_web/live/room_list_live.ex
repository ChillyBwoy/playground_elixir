defmodule PlaygroundWeb.RoomListLive do
  use PlaygroundWeb, :live_view

  alias Playground.Auth.User

  alias Playground.Chat.Room

  @impl true
  def mount(_params, _session, %{assigns: %{ current_user: %User{} = user }} = socket) do
    {:ok, assign(socket, :current_user, user)}
  end

  @impl true
  def handle_info({:room_created, %Room{} = room}, socket) do
    {:noreply,
     socket
      |> put_flash(:info, "Room created successfully")
      |> redirect(to: ~p"/rooms/#{room.id}")}
  end
end
