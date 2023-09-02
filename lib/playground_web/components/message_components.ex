defmodule PlaygroundWeb.MessageComponents do
  use Phoenix.Component
  use PlaygroundWeb, :verified_routes

  import PlaygroundWeb.UserComponents

  attr :messages, :list, required: true
  def message_list(assigns) do
    ~H"""
    <ul class="flex flex-col gap-4">
      <li :for={message <- @messages} class="grid grid-cols-[10%_1fr_20%]">
        <div>
          <.user_avatar user={message.author} />
        </div>
        <div>
          <%= message.content %>
        </div>
        <div class="whitespace-nowrap text-right">
          <%= message.inserted_at %>
        </div>
      </li>
    </ul>
    """
  end
end
