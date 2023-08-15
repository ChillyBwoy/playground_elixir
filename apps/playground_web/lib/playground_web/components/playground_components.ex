defmodule PlaygroundWeb.PlaygroundComponents do
  use Phoenix.Component

  attr :href, :any, required: true
  slot :inner_block, required: true
  attr :class, :string, default: nil

  def header_link(assigns) do
    ~H"""
    <.link
      navigate={@href}
      class={[
        "text-white text-xl",
        @class
      ]}
    >
      <%= render_slot(@inner_block) %>
    </.link>
    """
  end
end
