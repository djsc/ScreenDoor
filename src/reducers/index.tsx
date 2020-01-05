import { PostState } from './PostReducer';
import { AppState } from './AppReducer';
import { SettingsState } from './SettingsReducer';
import { AuthState } from './AuthReducer';
import { StatusState } from './StatusReducer';

export interface RootState {
    posts: PostState;
    app: AppState;
    settings: SettingsState;
    auth: AuthState;
    status: StatusState;
}