defmodule PlaygroundWeb.MessageComponents do
  use Phoenix.Component
  use PlaygroundWeb, :verified_routes

  import PlaygroundWeb.UserComponents

  attr :class, :string, default: nil
  attr :messages, :list, required: true

  def message_list(assigns) do
    ~H"""
    <ul class={["flex flex-col gap-4", @class]}>
      <li :for={message <- @messages} class="grid gap-2 grid-cols-[auto_1fr]">
        <div>
          <.user_avatar user={message.author} />
        </div>
        <div>
          <div class="whitespace-nowrap text-xs"><%= message.inserted_at %></div>
          <p><%= message.content %></p>
        </div>
      </li>
    </ul>
    """
  end
end
