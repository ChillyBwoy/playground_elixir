defmodule PlaygroundWeb.CanvasComponents do
  use Phoenix.Component
  use PlaygroundWeb, :verified_routes

  import PlaygroundWeb.CoreComponents

  attr :class, :string, default: nil
  attr :id, :string, required: true

  def canvas_form(assigns) do
    ~H"""
    <form id={@id} class={["flex gap-4", @class]}>
        <label class="cursor-pointer">
            <input type="radio" name="mode" value="move" class="hidden [&:checked+span]:bg-amber-400" checked />
            <.icon name="hero-arrows-pointing-out" class="h-8 w-8" />
        </label>
        <label class="cursor-pointer">
            <input type="radio" name="mode" value="draw" class="hidden [&:checked+span]:bg-amber-400" />
            <.icon name="hero-paint-brush" class="h-8 w-8" />
        </label>
    </form>
    """
  end
end