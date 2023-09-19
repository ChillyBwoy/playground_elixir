defmodule PlaygroundWeb.CanvasFormComponent do
  use PlaygroundWeb, :live_component

  alias Playground.Chalkboard
  alias Playground.Chalkboard.Canvas

  defp new_form do
    %Canvas{}
    |> Chalkboard.change_canvas()
    |> to_form(as: :canvas_form)
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
        "canvas_form:validate",
        %{"canvas_form" => params},
        %{assigns: %{room_id: room_id}} = socket
      ) do
    form =
      %Canvas{room_id: room_id}
      |> Chalkboard.change_canvas(params)
      |> Map.put(:action, :validate)
      |> to_form(as: :canvas_form)

    {:noreply, assign(socket, form: form)}
  end

  def handle_event(
        "canvas_form:submit",
        %{"canvas_form" => params},
        %{assigns: %{room_id: room_id}} = socket
      ) do
    params =
      params
      |> Map.put("room_id", room_id)

    case params |> Chalkboard.create_canvas() do
      {:ok, canvas} ->
        {:noreply, assign(socket, :canvas, canvas)}

      {:error, %Ecto.Changeset{} = changeset} ->
        {:noreply, assign(socket, :form, to_form(changeset, as: :canvas_form))}
    end
  end
end
