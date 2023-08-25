defmodule PlaygroundWeb.RoomListComponent do
  use PlaygroundWeb, :live_component

  import Ecto.Query

  alias Playground.Auth.User
  alias Playground.Chat
  alias Playground.Repo

  @impl true
  def update(assigns, socket) do
    rooms = Chat.list_rooms()

    list_of_ids =
      rooms
        |> Enum.map(& &1.user_id)
        |> MapSet.new()
        |> Enum.to_list()

    users =
      from(u in User, where: u.id in ^list_of_ids, select: {u.id, u})
      |> Repo.all()
      |> Map.new()

    rooms = Enum.map(rooms, fn room ->
      Map.put(room, :owner, users[room.user_id])
    end)

    {:ok,
     socket
      |> assign(assigns)
      |> assign(:rooms, rooms)}
  end
end
