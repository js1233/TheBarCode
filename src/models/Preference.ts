import DateTime from "models/DateTime";
import EIntBoolean from "models/enums/EIntBoolean";

type Preference = {
  id: number;
  title?: string;
  image?: string;
  status?: number;
  has_children?: EIntBoolean;
  level?: number;
  parent_id?: number;
  created_at?: DateTime;
  updated_at?: DateTime;
  deleted_at?: DateTime;
  main_parent?: number;
  is_user_interested?: boolean;
  is_establishment_interested?: boolean;
  is_offer_interested?: boolean;
  label?: string;
};

export default Preference;
