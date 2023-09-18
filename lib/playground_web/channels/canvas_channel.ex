defmodule PlaygroundWeb.CanvasChannel do
  use PlaygroundWeb, :channel

  alias Playground.Auth.User
  alias Playground.Chalkboard
  alias Playground.Chalkboard.Canvas

  alias PlaygroundWeb.Presence

  @impl true
  def join(
        "canvas:" <> canvas_id,
        _payload,
        %{assigns: %{current_user: %User{} = current_user}} = socket
      ) do
    case Chalkboard.get_canvas(canvas_id) do
      %Canvas{} = canvas ->
        send(self(), :after_join)
        {:ok, %{current_user: current_user, canvas: canvas}, socket}

      nil ->
        {:error, %{reason: "invalid canvas id"}}
    end
  end

  def handle_info(:after_join, %{assigns: %{current_user: %User{} = current_user}} = socket) do
    Presence.track_user(socket, current_user.id)
    {:noreply, socket}
  end

  @impl true
  def handle_info({PlaygroundWeb.PresenceClient, %{user_joined: _presence}}, socket) do
    push(socket, "presence_state", Presence.list(socket))
    {:noreply, socket}
  end

  @impl true
  def handle_info({PlaygroundWeb.PresenceClient, %{user_left: _presence}}, socket) do
    push(socket, "presence_state", Presence.list(socket))
    {:noreply, socket}
  end

  @impl true
  def handle_in("user:move", %{"user_id" => user_id, "x" => x, "y" => y}, socket) do
    broadcast!(socket, "user:move", %{user_id: user_id, x: x, y: y})
    {:noreply, socket}
  end

  @impl true
  def handle_in("user:draw", %{"user_id" => user_id, "data" => data}, socket) do
    broadcast!(socket, "user:draw", %{user_id: user_id, data: data})
    {:noreply, socket}
  end

  @impl true
  def handle_in("user:draw_end", %{"user_id" => user_id, "data" => data}, socket) do
    broadcast!(socket, "user:draw_end", %{user_id: user_id, data: data})
    {:noreply, socket}
  end

  @impl true
  def terminate(_reason, %{assigns: %{current_user: %User{} = current_user}} = socket) do
    Presence.untrack_user(socket, current_user.id)
  end
end
