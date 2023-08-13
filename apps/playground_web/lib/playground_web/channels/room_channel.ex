defmodule PlaygroundWeb.RoomChannel do
  use Phoenix.Channel

  intercept ["user_joined"]

  def join("room:lobby", _message, socket) do
    {:ok, socket}
  end

  def join("room:" <> _private_room_id, _params, _socket) do
    {:error, %{reason: "unauthorized"}}
  end

  def handle_in("dot:create", %{"dot" => dot}, socket) do
    broadcast!(socket, "dot:created", %{dot: dot})
    {:noreply, socket}
  end

  def handle_out("user_joined", _msg, socket) do
    {:noreply, socket}
  end
end
