defmodule PlaygroundWeb.AuthController do
  use PlaygroundWeb, :controller
  plug Ueberauth

  import Playground.Auth

  def callback(%{assigns: %{ueberauth_auth: auth}} = conn, _params) do
    new_user = auth
      |> user_from_oauth()
      |> get_or_create_user()

    case new_user do
      {:ok, user} ->
        conn
          |> put_flash(:info, "Welcome #{user.username}!")
          |> put_session(:user_id, user.id)
          |> redirect(to: "/")
      {:error, _changeset} ->
        conn
          |> put_flash(:error, "Something went wrong")
          |> redirect(to: "/")
    end
  end

  def signout(conn, _params) do
    conn
      |> configure_session(drop: true)
      |> redirect(to: "/")
  end
end
