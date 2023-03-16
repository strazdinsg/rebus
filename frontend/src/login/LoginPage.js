/**
 * Page shown when the user must log in.
 * @returns {JSX.Element}
 * @constructor
 */
export function LoginPage() {
  return (
    <form>
      <label>
        PIN for your team:
        <input
          type="number"
          min="111111"
          max="999999"
          maxLength="6"
          placeholder="123456"
        />
      </label>
      <input type="submit" value="Go!" />
    </form>
  );
}
