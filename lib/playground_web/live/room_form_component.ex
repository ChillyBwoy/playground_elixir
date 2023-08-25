defmodule PlaygroundWeb.RoomFormComponent do
  use PlaygroundWeb, :live_component

  alias Playground.Chat
  alias Playground.Chat.Room

  @impl true
  def update(assigns, socket) do
    form =
      %Room{}
        |> Chat.change_room()
        |> to_form(as: :room_form)

    {:ok,
     socket
      |> assign(assigns)
      |> assign(:form, form)}
  end

  @impl true
  def handle_event("room_form:validate", %{"room_form" => params}, %{assigns: %{user_id: user_id}} = socket) do
    form =
      %Room{user_id: user_id}
        |> Chat.change_room(params)
        |> Map.put(:action, :validate)
        |> to_form(as: :room_form)

    {:noreply, assign(socket, form: form)}
  end

  @impl true
  def handle_event("room_form:create", %{"room_form" => params}, %{assigns: %{ user_id: user_id }} = socket) do
    case params |> Map.put("user_id", user_id) |> Chat.create_room() do
      {:ok, room} ->
        send(self(), {:room_created, room})
        {:noreply, socket}

      {:error, %Ecto.Changeset{} = changeset} ->
        {:noreply,
         socket
          |> assign(:form, to_form(changeset, as: :room_form))}
    end
  end
end
