defmodule PlaygroundWeb.RoomListComponent do
  use PlaygroundWeb, :live_component

  @impl true
  def update(assigns, socket) do
    {:ok, assign(socket, assigns)}
  end
end
