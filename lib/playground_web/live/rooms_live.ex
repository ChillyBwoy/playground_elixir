defmodule PlaygroundWeb.RoomsLive do
  use PlaygroundWeb, :live_view

  alias Playground.Auth.User
  alias Playground.Chat
  alias Playground.Chat.Room

  @impl true
  def mount(_params, _session, %{assigns: %{ current_user: %User{} }} = socket) do
    changeset = Chat.change_room(%Room{})

    {:ok,
     socket
      |> assign(:rooms, Chat.list_rooms())
      |> assign(:form, to_form(changeset, as: :room_form))}
  end

  @impl true
  def handle_event("new_room:validate", %{"room_form" => params}, %{assigns: %{ current_user: %User{} = user }} = socket) do
    form =
      %Room{user_id: user.id}
        |> Chat.change_room(params)
        |> Map.put(:action, :validate)
        |> to_form(as: :room_form)

    {:noreply, assign(socket, form: form)}
  end

  @impl true
  def handle_event("new_room:create", %{"room_form" => params}, %{assigns: %{ current_user: %User{} = user }} = socket) do
    params = Map.put(params, "user_id", user.id)

    case Chat.create_room(params) do
      {:ok, room} ->
        {:noreply,
         socket
          |> assign(:rooms, [room | socket.assigns.rooms])
          |> put_flash(:info, "Room created successfully")
          |> redirect(to: ~p"/rooms/#{room.id}")}

      {:error, %Ecto.Changeset{} = changeset} ->
        {:noreply,
         socket
          |> assign(:form, to_form(changeset, as: :room_form))}
    end
  end
end
