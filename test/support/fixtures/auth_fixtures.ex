defmodule Playground.AuthFixtures do
  @moduledoc """
  This module defines test helpers for creating
  entities via the `Playground.Auth` context.
  """

  @doc """
  Generate a unique user username.
  """
  def unique_user_username, do: "some username#{System.unique_integer([:positive])}"

  @doc """
  Generate a unique user email.
  """
  def unique_user_email, do: "some email#{System.unique_integer([:positive])}"

  @doc """
  Generate a user.
  """
  def user_fixture(attrs \\ %{}) do
    {:ok, user} =
      attrs
      |> Enum.into(%{
        username: unique_user_username(),
        provider: "some provider",
        email: unique_user_email(),
        avatar_url: "some avatar_url"
      })
      |> Playground.Auth.create_user()

    user
  end
end
