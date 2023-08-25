defmodule PlaygroundWeb.PageController do
  use PlaygroundWeb, :controller
  import PlaygroundWeb.UserAuth

  plug :require_authenticated_user when action in [:canvas]

  def home(conn, _params) do
    # The home page is often custom made,
    # so skip the default app layout.
    render(conn, :home, layout: false)
  end

  def canvas(conn, _params) do
    render(conn, :canvas, layout: false)
  end

  def info(conn, _params) do
    render(conn, :info, layout: false)
  end
end
