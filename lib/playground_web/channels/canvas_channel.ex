defmodule PlaygroundWeb.CanvasChannel do
  use PlaygroundWeb, :channel
  alias Playground.Repo
  alias Playground.Auth.User
  alias Playground.Chalkboard
  alias Playground.Chalkboard.{Canvas, Shape}
  alias PlaygroundWeb.Presence
  alias PlaygroundWeb.Tools.MapTransform
  alias PlaygroundWeb.Tools.StringTransform

  @impl true
  def join(
        "canvas:" <> canvas_id,
        _payload,
        %{assigns: %{current_user: %User{} = current_user}} = socket
      ) do
    case Chalkboard.get_canvas(canvas_id) |> Repo.preload([:shapes]) do
      %Canvas{} = canvas ->
        send(self(), :after_join)
        {:ok, %{current_user: current_user, canvas: canvas}, socket |> assign(:canvas, canvas)}

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
  def handle_in(
        "user:draw_end",
        %{"user_id" => user_id, "data" => data},
        %{assigns: %{canvas: canvas}} = socket
      ) do
    updated_data =
      data |> MapTransform.transform_keys(fn x -> StringTransform.snake_case_from(x) end)

    form =
      %Shape{}
      |> Shape.changeset(%{user_id: user_id, canvas_id: canvas.id, shape_data: updated_data})
      |> Map.put(:action, :validate)

    if form.valid? do
      {:ok, shape} = form |> Map.put(:action, :insert) |> Repo.insert()
      broadcast!(socket, "user:draw_end", shape)
    end

    {:noreply, socket}
  end

  @impl true
  def terminate(_reason, %{assigns: %{current_user: %User{} = current_user}} = socket) do
    Presence.untrack_user(socket, current_user.id)
  end
end
