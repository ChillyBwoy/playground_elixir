defmodule PlaygroundWeb.CanvasChannel do
  use PlaygroundWeb, :channel

  alias Playground.Auth.User
  alias Playground.Chat
  alias Playground.Chat.Room
  alias Playground.Chalkboard
  alias Playground.Chalkboard.Canvas
  alias Playground.Repo

  alias PlaygroundWeb.Presence

  @impl true
  def join("canvas:" <> canvas_id, payload, %{assigns: %{current_user: %User{} = current_user}} = socket) do
    if authorized?(payload) do
      case Chalkboard.get_canvas!(canvas_id) do
        %Canvas{} = canvas ->
          send(self(), :after_join)
          {:ok, %{current_user: current_user, canvas: canvas }, socket}
        nil ->
          {:error, %{reason: "invalid canvas id"}}
      end
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  @impl true
  def handle_info(:after_join, %{assigns: %{current_user: %User{} = current_user}} = socket) do
    {:ok, _} = Presence.track(socket, current_user.id, %{
      joined: inspect(System.system_time(:second))
    })

    push(socket, "presence_state", Presence.list(socket))
    {:noreply, socket}
  end

  @impl true
  def handle_in("user:move", %{"user_id" => user_id, "x" => x, "y" => y}, socket) do
    broadcast!(socket, "user:move", %{user_id: user_id, x: x, y: y})
    {:noreply, socket}
  end

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
