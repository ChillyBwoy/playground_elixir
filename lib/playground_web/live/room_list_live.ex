defmodule PlaygroundWeb.RoomListLive do
  use PlaygroundWeb, :live_view

  alias Playground.PubSub
  alias Playground.Auth.User
  alias Playground.Chat
  alias Playground.Repo

  @impl true
  def mount(_params, _session, %{assigns: %{current_user: %User{} = current_user}} = socket) do
    if connected?(socket), do: PubSub.subscribe()

    {:ok,
     socket
     |> assign(:current_user, current_user)
     |> assign(:rooms, Chat.list_rooms() |> Repo.preload([:owner]))}
  end

  @impl true
  def handle_info({PlaygroundWeb.RoomFormComponent, :room_created, room}, socket) do
    {
      :noreply,
      socket
      |> put_flash(:info, "Room created successfully")
      |> redirect(to: ~p"/rooms/#{room.id}")
    }
  end

  def handle_info({:room_created, room}, socket) do
    next_rooms = socket.assigns.rooms ++ [room |> Repo.preload([:owner])]

    {:noreply, assign(socket, :rooms, next_rooms)}
  end

  def handle_info({:room_deleted, room}, socket) do
    next_rooms = socket.assigns.rooms |> Enum.reject(fn r -> r.id == room.id end)

    {:noreply, assign(socket, :rooms, next_rooms)}
  end

  def handle_info(_event, socket), do: {:noreply, socket}

  @impl true
  def handle_event(
        "room_list:delete",
        %{"id" => room_id},
        %{assigns: %{current_user: %User{} = current_user}} = socket
      ) do
    room = Chat.get_room!(room_id)

    if room.user_id == current_user.id do
      {:ok, _} = Chat.delete_room(room)
      {:noreply, socket |> put_flash(:info, "Room \"#{room.name}\" deleted successfully")}
    else
      {:noreply, socket |> put_flash(:error, "You are not the owner of this room")}
    end
  end
end
