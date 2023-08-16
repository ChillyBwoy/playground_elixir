defmodule PlaygroundWeb.AuthController do
  use PlaygroundWeb, :controller
  plug Ueberauth

  import Playground.Auth

  def callback(%{assigns: %{ueberauth_auth: auth}} = conn, _params) do
    new_user =
      auth
      |> user_from_oauth()
      |> get_or_create_user()

    case new_user do
      {:ok, user} ->
        conn
        |> put_session(:user_id, user.id)
        # |> put_session(:id, auth.credentials.token)
        # |> put_resp_cookie("session_id", auth.credentials.token, [http_only: true])
        |> put_flash(:info, "Welcome, #{user.username}!")
        |> redirect(to: "/")

      {:error, _changeset} ->
        conn
        |> redirect(to: "/")
    end
  end

  def signout(conn, _params) do
    conn
    |> configure_session(drop: true)
    |> redirect(to: "/")
  end
end
