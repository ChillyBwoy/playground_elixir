defmodule Playground.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  @impl true
  def start(_type, _args) do
    children = [
      # Start the Telemetry supervisor
      PlaygroundWeb.Telemetry,
      # Start the Ecto repository
      Playground.Repo,
      # Start the PubSub system
      {Phoenix.PubSub, name: Playground.PubSub},
      PlaygroundWeb.Presence,
      # Start Finch
      {Finch, name: Playground.Finch},
      # Start the Endpoint (http/https)
      PlaygroundWeb.Endpoint
      # Start a worker by calling: Playground.Worker.start_link(arg)
      # {Playground.Worker, arg}
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: Playground.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  @impl true
  def config_change(changed, _new, removed) do
    PlaygroundWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
