defmodule PlaygroundWeb.CanvasChannel do
  use PlaygroundWeb, :channel

  import Ecto.UUID

  alias Playground.Auth, as: Auth
  alias Playground.Auth.User

  @impl true
  def join("canvas:lobby", payload, socket) do
    if authorized?(payload) do
      user_token = socket.assigns[:user_token]

      case Auth.get_user_by_token(user_token) do
        %User{} = user ->
          {:ok, %{id: user.id, avatar_url: user.avatar_url, username: user.username}, socket}

        nil ->
          {:error, %{reason: "unauthorized"}}
      end
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  # Channels can be used in a request/response fashion
  # by sending replies to requests from the client
  @impl true
  def handle_in("ping", payload, socket) do
    {:reply, {:ok, payload}, socket}
  end

  # It is also common to receive messages from the client and
  # broadcast to everyone in the current topic (canvas:lobby).
  @impl true
  def handle_in("shout", payload, socket) do
    broadcast(socket, "shout", payload)
    {:noreply, socket}
  end

  @impl true
  def handle_in("user:move", %{"id" => id, "x" => x, "y" => y}, socket) do
    broadcast!(socket, "user:moved", %{id: id, x: x, y: y})
    {:noreply, socket}
  end

  @impl true
  def handle_in("user:join", %{"id" => id}, socket) do
    case Auth.get_user!(id) do
      nil ->
        {:noreply, socket}
      user ->
        broadcast!(socket, "user:joined", %{id: user.id, avatar_url: user.avatar_url, username: user.username})
        {:noreply, socket}
    end
  end

  @impl true
  def handle_in("dot:create", %{"dot" => dot}, socket) do
    new_dot =
      dot
      |> Map.put("id", generate())

    broadcast!(socket, "dot:created", %{dot: new_dot})
    {:noreply, socket}
  end

  # Add authorization logic here as required.
  defp authorized?(_payload) do
    true
  end
end
