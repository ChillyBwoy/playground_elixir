defmodule PlaygroundWeb.RoomListLive do
  use PlaygroundWeb, :live_view

  import PlaygroundWeb.RoomComponents

  alias Playground.Auth
  alias Playground.Auth.User
  alias Playground.Chat
  alias Playground.Chat.Room

  @impl true
  def mount(_params, _session, %{assigns: %{ current_user: %User{} = user }} = socket) do
    {:ok,
      socket
        |> assign(:current_user, user)
        |> assign(:rooms, fetch_room())}
  end

  @impl true
  def handle_info({:room_created, %Room{} = room}, socket) do
    {:noreply,
     socket
      |> put_flash(:info, "Room created successfully")
      |> redirect(to: ~p"/rooms/#{room.id}")}
  end

  defp fetch_room() do
    rooms = Chat.list_rooms()

    list_of_ids =
      rooms
        |> Enum.map(& &1.user_id)
        |> MapSet.new()
        |> Enum.to_list()

    users = Auth.get_user_map_by_ids(list_of_ids)

    Enum.map(rooms, fn room ->
      Map.put(room, :owner, users[room.user_id])
    end)
  end
end
