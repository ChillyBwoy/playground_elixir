defmodule PlaygroundWeb.RoomComponents do
  use Phoenix.Component
  use PlaygroundWeb, :verified_routes

  import PlaygroundWeb.UserComponents

  attr :rooms, :list, required: true
  def room_list(assigns) do
    ~H"""
    <ul class="flex flex-col gap-4">
      <li :for={room <- @rooms} class="grid grid-cols-[10%_1fr_20%]">
        <div>
          <.user_avatar user={room.owner} />
        </div>
        <.link navigate={~p"/rooms/#{room.id}"}>
          <%= room.name %>
        </.link>
        <div class="whitespace-nowrap text-right">
            <%= room.inserted_at.year %>-<%= room.inserted_at.month %>-<%= room.inserted_at.day %>
        </div>
      </li>
    </ul>
    """
  end
end
