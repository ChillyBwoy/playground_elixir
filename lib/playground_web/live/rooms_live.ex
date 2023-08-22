defmodule PlaygroundWeb.RoomsLive do
  use PlaygroundWeb, :live_view

  alias Playground.Auth
  alias Playground.Auth.User
  alias Playground.Auth.Token, as: Token
  alias Playground.Chat
  alias Playground.Chat.Room

  @impl true
  def mount(_params, session, socket) do
    token = session["user_token"]

    IO.puts("\n\n**************")
    IO.inspect(token)
    IO.puts("**************\n\n")

    new_room = %Room{}
    changeset = Chat.change_room(new_room)

    {:ok,
     socket
      |> assign(:rooms, Chat.list_rooms())
      |> assign(:new_room, new_room)
      |> assign(:changeset, changeset)
      |> assign(:valid, false)}
  end

  @impl true
  def handle_event("new_room:validate", %{"new_room" => new_room_params}, socket) do
    changeset =
      socket.assigns.new_room
      |> Chat.change_room(new_room_params)
      |> Map.put(:action, :validate)

    {:noreply,
      socket
      |> assign(:valid, changeset.valid?)
      |> assign(:changeset, changeset)}
  end

  @impl true
  def handle_event("new_room:create", %{"new_room" => new_room_params}, socket) do
    if socket.assigns.valid do

      # changeset =
      #   socket.assigns.new_room
      #   |> Chat.change_room(new_room_params)

      case Chat.create_room(new_room_params) do
        {:ok, room} ->
          list_of_rooms = [room | socket.assigns.rooms]

          {:noreply,
          socket
          |> assign(:rooms, list_of_rooms)
          |> assign(:valid, false)
          |> put_flash(:info, "Room created successfully.")}

        {:error, %Ecto.Changeset{} = changeset} ->
          {:noreply,
            socket
            |> assign(:changeset, changeset)
            |> put_flash(:error, "Something went wrong.")}
      end
    else
      {:noreply, socket}
    end
  end

  defp button_valid(true), do: "bg-indigo-400"
  defp button_valid(false), do: "bg-gray-400"
end
