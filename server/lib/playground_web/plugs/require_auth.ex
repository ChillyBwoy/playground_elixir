defmodule PlaygroundWeb.Plugs.RequireAuth do
  import Plug.Conn
  import Phoenix.Controller

  def init(opts), do: opts

  def call(conn, _params) do
    if conn.assigns[:user] do
      conn
    else
      conn
        |> redirect(to: "/")
        |> halt()
    end

  end
end
