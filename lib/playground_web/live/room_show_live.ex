defmodule PlaygroundWeb.RoomShowLive do
  use PlaygroundWeb, :live_view

  import PlaygroundWeb.UserComponents

  alias Playground.Auth.User
  alias Playground.Chat
  alias Playground.Repo

  @impl true
  def mount(_params, _session, %{assigns: %{ current_user: %User{} }} = socket) do
    {:ok, socket}
  end

  @impl true
  def handle_params(%{"id" => id}, _uri, socket) do
    room = Chat.get_room!(id) |> Repo.preload([:owner])

    {:noreply,
     socket
      |> assign(:room, room)}
  end
end
