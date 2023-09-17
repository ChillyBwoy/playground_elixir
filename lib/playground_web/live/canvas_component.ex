defmodule PlaygroundWeb.CanvasComponent do
  use PlaygroundWeb, :live_component

  alias Playground.Chalkboard.Canvas

  @impl true
  def update(%{canvas: %Canvas{} = canvas} = assigns, socket) do
    {:ok,
      socket
        |> assign(:canvas, canvas)
        |> assign(:hook_name, "CanvasHook")}
  end


end
