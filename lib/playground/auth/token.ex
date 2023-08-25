defmodule Playground.Auth.Token do
  @sign_salt "elixir_playground:auth:token"
  @max_age 60 * 60 * 24 * 30

  def sign(data) do
    Phoenix.Token.sign(PlaygroundWeb.Endpoint, @sign_salt, data)
  end

  def verify(token) do
    Phoenix.Token.verify(PlaygroundWeb.Endpoint, @sign_salt, token, max_age: @max_age)
  end
end
