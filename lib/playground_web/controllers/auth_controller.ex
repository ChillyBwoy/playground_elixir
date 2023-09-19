defmodule PlaygroundWeb.AuthController do
  use PlaygroundWeb, :controller
  alias Playground.Auth.Token, as: Token

  import Playground.Auth

  plug Ueberauth

  def callback(%{assigns: %{ueberauth_failure: _}} = conn, _params) do
    conn
    |> put_flash(:error, "Failed to authenticate.")
    |> redirect(to: "/")
  end

  def callback(%{assigns: %{ueberauth_auth: auth}} = conn, _params) do
    with {:ok, user_attrs} <- user_attrs_from_oauth(auth),
         {:ok, user} <- get_or_create_user(user_attrs) do
      conn
      |> put_session(:user_token, Token.sign(%{user_id: user.id}))
      |> put_flash(:info, "Welcome, #{user.username}!")
      |> redirect(to: "/")
    else
      {:error, reason} ->
        conn
        |> put_flash(:error, reason)
        |> redirect(to: "/")
    end
  end

  def signout(conn, _params) do
    conn
    |> configure_session(drop: true)
    |> redirect(to: "/")
  end
end
