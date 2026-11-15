import { Field } from "./ui";

/** Latitude / longitude inputs, shared by every geo-located entity form. */
export function CoordinatesFields({ latitude, longitude, hint }: { latitude?: number | null; longitude?: number | null; hint?: string }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <Field label="Latitude" name="latitude" type="number" step="any" min="-90" max="90" defaultValue={latitude ?? ""} placeholder="33.8938"
        hint={hint ?? "Used to place it on the map. Tip: right-click a place in Google Maps to copy its coordinates."} />
      <Field label="Longitude" name="longitude" type="number" step="any" min="-180" max="180" defaultValue={longitude ?? ""} placeholder="35.5018" />
    </div>
  );
}
