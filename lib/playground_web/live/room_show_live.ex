defmodule PlaygroundWeb.RoomShowLive do
  use PlaygroundWeb, :live_view

  alias Playground.Auth.User
  alias Playground.Chat

  @impl true
  def mount(_params, _session, %{assigns: %{ current_user: %User{} }} = socket) do
    {:ok, socket}
  end

  @impl true
  def handle_params(%{"id" => id}, _uri, socket) do
    room = Chat.get_room!(id)

    {:noreply,
     socket
      |> assign(:room, room)}
  end
end
