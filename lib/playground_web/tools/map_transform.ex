defmodule PlaygroundWeb.Tools.MapTransform do
  def transform_keys(map, transformer) do
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
