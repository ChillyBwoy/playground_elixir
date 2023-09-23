defmodule PlaygroundWeb.Tools.MapTransform do
  @doc """
  Transforms all keys in a map using the provided transformer function.

  ## Examples

    iex> transform_keys(%{a: 1, b: 2}, &String.upcase/1)
    %{"A" => 1, "B" => 2}

  ## Arguments

  * `map` - A map to transform the keys of.
  * `transformer` - A function that takes a key and returns a new key.

  Returns the transformed map.
  """
  def transform_keys(map, transformer) when is_map(map) and is_function(transformer, 1) do
    transform_keys_recur(map, transformer)
  end

  defp transform_keys_recur(%Date{} = val, _), do: val
  defp transform_keys_recur(%DateTime{} = val, _), do: val
  defp transform_keys_recur(%NaiveDateTime{} = val, _), do: val

  defp transform_keys_recur(map, transformer) when is_map(map) do
    for {key, val} <- map, into: %{} do
      next_key = transformer.(key)
      {next_key, transform_keys_recur(val, transformer)}
    end
  end

  defp transform_keys_recur(val, _), do: val
end
