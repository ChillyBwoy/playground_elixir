defmodule Playground.ChalkboardFixtures do
  @moduledoc """
  This module defines test helpers for creating
  entities via the `Playground.Chalkboard` context.
  """

  @doc """
  Generate a canvas.
  """
  def canvas_fixture(attrs \\ %{}) do
    {:ok, canvas} =
      attrs
      |> Enum.into(%{
        name: "some name"
      })
      |> Playground.Chalkboard.create_canvas()

    canvas
  end
end
