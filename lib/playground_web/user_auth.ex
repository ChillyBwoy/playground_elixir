defmodule PlaygroundWeb.UserAuth do
  use PlaygroundWeb, :verified_routes

  import Plug.Conn
  import Phoenix.Controller

  alias Playground.Auth
  alias Playground.Auth.User

  def fetch_current_user(conn, _opts) do
    token = get_session(conn, :user_token)

    case Auth.get_user_by_token(token) do
      %User{} = user ->
        assign(conn, :current_user, user)

      _ ->
        assign(conn, :current_user, nil)
    end
  end

  def require_authenticated_user(conn, _opts) do
    if conn.assigns[:current_user] do
      conn
    else
      conn
        |> put_flash(:error, "You must be logged in to access this page.")
        |> maybe_store_return_to()
        |> redirect(to: ~p"/")
        |> halt()
    end
  end

  def on_mount(:ensure_authenticated, _params, session, socket) do
    socket = mount_current_user(socket, session)

    if socket.assigns.current_user do
      {:cont, socket}
    else
      socket =
        socket
        |> Phoenix.LiveView.put_flash(:error, "You must log in to access this page.")
        |> Phoenix.LiveView.redirect(to: ~p"/")

      {:halt, socket}
    end
  end

  defp mount_current_user(socket, session) do
    Phoenix.Component.assign_new(socket, :current_user, fn ->
      if user_token = session["user_token"] do
        Auth.get_user_by_token(user_token)
      end
    end)
  end

  defp maybe_store_return_to(%{method: "GET"} = conn) do
    put_session(conn, :user_return_to, current_path(conn))
  end

  defp maybe_store_return_to(conn), do: conn
end
