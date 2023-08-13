defmodule Playground.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  @impl true
  def start(_type, _args) do
    children = [
      # Start the Ecto repository
      Playground.Repo,
      # Start the PubSub system
      {Phoenix.PubSub, name: Playground.PubSub},
      # Start Finch
      {Finch, name: Playground.Finch}
      # Start a worker by calling: Playground.Worker.start_link(arg)
      # {Playground.Worker, arg}
    ]

    Supervisor.start_link(children, strategy: :one_for_one, name: Playground.Supervisor)
  end
end
