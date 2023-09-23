defmodule PlaygroundWeb.MessageFormComponent do
  use PlaygroundWeb, :live_component

  alias Playground.Chat
  alias Playground.Chat.Message

  defp new_form do
    %Message{}
    |> Chat.change_message()
    |> to_form(as: :message_form)
  end

  @impl true
  def update(assigns, socket) do
    {:ok,
     socket
     |> assign(assigns)
     |> assign(:form, new_form())}
  end

  @impl true
  def handle_event(
        "message_form:validate",
        %{"message_form" => params},
        %{assigns: %{user_id: user_id, room_id: room_id}} = socket
      ) do
    form =
      %Message{user_id: user_id, room_id: room_id}
      |> Chat.change_message(params)
      |> Map.put(:action, :validate)
      |> to_form(as: :message_form)

    {:noreply, assign(socket, form: form)}
  end

  @impl true
  def handle_event(
        "message_form:create",
        %{"message_form" => params},
        %{assigns: %{user_id: user_id, room_id: room_id}} = socket
      ) do
    attrs =
      params
      |> Map.put("user_id", user_id)
      |> Map.put("room_id", room_id)

    case Chat.create_message(attrs) do
      {:ok, message} ->
        send(self(), {:message_created, message})

        {:noreply, socket |> assign(:form, new_form())}

      {:error, %Ecto.Changeset{} = changeset} ->
        form = to_form(changeset, as: :room_form)

        {:noreply, socket |> assign(:form, form)}
    end
  end
end
