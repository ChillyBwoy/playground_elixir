defmodule PlaygroundWeb.CanvasChannel do
  use PlaygroundWeb, :channel

  @impl true
  def join("canvas:" <> _room_id, payload, socket) do
    if authorized?(payload) do
      {:ok, socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  # @impl true
  # def handle_in("user:move", %{"id" => id, "x" => x, "y" => y}, socket) do
  #   broadcast!(socket, "user:moved", %{id: id, x: x, y: y})
  #   {:noreply, socket}
  # end

  # @impl true
  # def handle_in("dot:create", %{"dot" => dot}, socket) do
  #   new_dot =
  #     dot
  #     |> Map.put("id", generate())

  #   broadcast!(socket, "dot:created", %{dot: new_dot})
  #   {:noreply, socket}
  # end

  # Add authorization logic here as required.
  defp authorized?(_payload) do
    true
  end
end
