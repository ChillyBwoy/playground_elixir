defmodule PlaygroundWeb.Router do
  use PlaygroundWeb, :router

  pipeline :api do
    plug :accepts, ["json"]
  end

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :protect_from_forgery
    plug :put_secure_browser_headers
    plug PlaygroundWeb.Plugs.SetUser
  end

  scope "/api", PlaygroundWeb do
    pipe_through :api
  end

  scope "/auth", PlaygroundWeb do
    pipe_through :browser

    get "/signout", AuthController, :signout
    get "/signin/:provider", AuthController, :request
    get "/signin/:provider/callback", AuthController, :callback
  end

  # Enable LiveDashboard in development
  if Application.compile_env(:playground, :dev_routes) do
    # If you want to use the LiveDashboard in production, you should put
    # it behind authentication and allow only admins to access it.
    # If your application does not have an admins-only section yet,
    # you can use Plug.BasicAuth to set up some basic authentication
    # as long as you are also using SSL (which you should anyway).
    import Phoenix.LiveDashboard.Router

    scope "/dev" do
      pipe_through [:fetch_session, :protect_from_forgery]

      live_dashboard "/dashboard", metrics: PlaygroundWeb.Telemetry
    end
  end
end
