defmodule PlaygroundWeb.Plugs.SetUser do
  import Plug.Conn

  import Playground.Auth
  alias Playground.Auth.User

  def init(opts), do: opts

  def call(conn, _opts) do
    user_id = get_session(conn, :user_id)

    case user_id do
      user_id when is_bitstring(user_id) ->
        case get_user!(user_id) do
          %User{} = user ->
            assign(conn, :user, user)
          nil ->
            assign(conn, :user, nil)
        end

      nil -> assign(conn, :user, nil)
    end
  end
end
