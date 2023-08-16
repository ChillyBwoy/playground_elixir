defmodule PlaygroundWeb.PageController do
  use PlaygroundWeb, :controller
  # plug PlaygroundWeb.Plugs.RequireAuth when action in [:info]

  def home(conn, _params) do
    # The home page is often custom made,
    # so skip the default app layout.
    render(conn, :home, layout: false)
  end

  def info(conn, _params) do
    render(conn, :info, layout: false)
  end
end
