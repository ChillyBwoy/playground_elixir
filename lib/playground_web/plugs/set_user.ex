defmodule PlaygroundWeb.Plugs.SetUser do
  import Plug.Conn

  import Playground.Auth

  def init(opts), do: opts

  def call(conn, _opts) do
    user_id = get_session(conn, :user_id)

    try do
      case get_user!(user_id) do
        nil -> assign(conn, :user, nil)
        user -> assign(conn, :user, user)
      end
    rescue
      _ -> assign(conn, :user, nil)
    end
  end
end
