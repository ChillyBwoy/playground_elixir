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

  def on_mount(:ensure_authenticated, _params, %{"user_token" => user_token}, socket) do
    case Auth.get_user_by_token(user_token) do
      %User{} = user ->
        {:cont,
         socket
         #  assignuser to session
         |> Phoenix.Component.assign(:current_user, user)
         #  assign user_token to use it in channels
         |> Phoenix.Component.assign(:user_token, user_token)}

      _ ->
        {:halt,
         socket
         |> Phoenix.LiveView.put_flash(:error, "You must log in to access this page.")
         |> Phoenix.LiveView.redirect(to: ~p"/")}
    end
  end

  defp maybe_store_return_to(%{method: "GET"} = conn) do
    put_session(conn, :user_return_to, current_path(conn))
  end

  defp maybe_store_return_to(conn), do: conn
end
