defmodule PlaygroundWeb.PageController do
  use PlaygroundWeb, :controller
  plug PlaygroundWeb.Plugs.RequireAuth when action in [:canvas]

  def home(conn, _params) do
    # The home page is often custom made,
    # so skip the default app layout.
    render(conn, :home, layout: false)
  end

  def canvas(conn, _params) do
    render(conn, :canvas, layout: false)
  end
end
