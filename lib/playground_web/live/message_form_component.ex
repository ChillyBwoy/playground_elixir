defmodule PlaygroundWeb.MessageFormComponent do
  use PlaygroundWeb, :live_component

  alias Playground.Chat
  alias Playground.Chat.Message
  alias Playground.Auth

  @impl true
  def update(assigns, socket) do
    form =
      %Message{}
        |> Chat.change_message()
        |> to_form(as: :message_form)

    {:ok,
     socket
      |> assign(assigns)
      |> assign(:form, form)}
  end

  @impl true
  def handle_event("message_form:validate", %{"message_form" => params}, %{assigns: %{user_id: user_id, room_id: room_id}} = socket) do
    form =
      %Message{user_id: user_id, room_id: room_id}
        |> Chat.change_message(params)
        |> Map.put(:action, :validate)
        |> to_form(as: :message_form)

    {:noreply, assign(socket, form: form)}
  end

  @impl true
  def handle_event("message_form:create", %{"message_form" => params}, %{assigns: %{user_id: user_id, room_id: room_id}} = socket) do
    params =
      params
        |> Map.put("user_id", user_id)
        |> Map.put("room_id", room_id)

    case params |> Chat.create_message() do
      {:ok, message} ->

        user = Auth.get_user!(user_id)
        send(self(), {:message_created, message |> Map.put(:author, user)})
        {:noreply, socket}

      {:error, %Ecto.Changeset{} = changeset} ->
        {:noreply,
          socket
          |> assign(:form, to_form(changeset, as: :room_form))}
    end
  end
end
