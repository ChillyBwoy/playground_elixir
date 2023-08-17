defmodule PlaygroundWeb.Plugs.SetUser do
  import Plug.Conn

  import Playground.Auth

  def init(opts), do: opts

  def call(conn, _opts) do
    user_id = get_session(conn, :user_id)

    try do
      case get_user!(user_id) do
        nil -> assign(conn, :user, nil)
        user ->
          token = Phoenix.Token.sign(conn, "user socket", user.id)
          conn
            |> assign(:user, user)
            |> assign(:user_token, token)
      end
    rescue
      _ -> assign(conn, :user, nil)
    end
  end
end
