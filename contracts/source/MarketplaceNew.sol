// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;


// OpenZeppelin Contracts v4.4.1 (utils/Context.sol)
/**
 * @dev Provides information about the current execution context, including the
 * sender of the transaction and its data. While these are generally available
 * via msg.sender and msg.data, they should not be accessed in such a direct
 * manner, since when dealing with meta-transactions the account sending and
 * paying for execution may not be the actual sender (as far as an application
 * is concerned).
 *
 * This contract is only required for intermediate, library-like contracts.
 */
abstract contract Context {
    function _msgSender() internal view virtual returns (address) {
        return msg.sender;
    }

    function _msgData() internal view virtual returns (bytes calldata) {
        return msg.data;
    }
}

// OpenZeppelin Contracts (last updated v4.7.0) (access/Ownable.sol)

/**
 * @dev Contract module which provides a basic access control mechanism, where
 * there is an account (an owner) that can be granted exclusive access to
 * specific functions.
 *
 * By default, the owner account will be the one that deploys the contract. This
 * can later be changed with {transferOwnership}.
 *
 * This module is used through inheritance. It will make available the modifier
 * `onlyOwner`, which can be applied to your functions to restrict their use to
 * the owner.
 */
abstract contract Ownable is Context {
    address private _owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    /**
     * @dev Initializes the contract setting the deployer as the initial owner.
     */
    constructor() {
        _transferOwnership(_msgSender());
    }

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        _checkOwner();
        _;
    }

    /**
     * @dev Returns the address of the current owner.
     */
    function owner() public view virtual returns (address) {
        return _owner;
    }

    /**
     * @dev Throws if the sender is not the owner.
     */
    function _checkOwner() internal view virtual {
        require(owner() == _msgSender(), "Ownable: caller is not the owner");
    }

    /**
     * @dev Leaves the contract without owner. It will not be possible to call
     * `onlyOwner` functions anymore. Can only be called by the current owner.
     *
     * NOTE: Renouncing ownership will leave the contract without an owner,
     * thereby removing any functionality that is only available to the owner.
     */
    function renounceOwnership() public virtual onlyOwner {
        _transferOwnership(address(0));
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Can only be called by the current owner.
     */
    function transferOwnership(address newOwner) public virtual onlyOwner {
        require(newOwner != address(0), "Ownable: new owner is the zero address");
        _transferOwnership(newOwner);
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Internal function without access restriction.
     */
    function _transferOwnership(address newOwner) internal virtual {
        address oldOwner = _owner;
        _owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }
}

// OpenZeppelin Contracts v4.4.1 (token/ERC20/extensions/IERC20Permit.sol)

/**
 * @dev Interface of the ERC20 Permit extension allowing approvals to be made via signatures, as defined in
 * https://eips.ethereum.org/EIPS/eip-2612[EIP-2612].
 *
 * Adds the {permit} method, which can be used to change an account's ERC20 allowance (see {IERC20-allowance}) by
 * presenting a message signed by the account. By not relying on {IERC20-approve}, the token holder account doesn't
 * need to send a transaction, and thus is not required to hold Ether at all.
 */
interface IERC20Permit {
    /**
     * @dev Sets `value` as the allowance of `spender` over ``owner``'s tokens,
     * given ``owner``'s signed approval.
     *
     * IMPORTANT: The same issues {IERC20-approve} has related to transaction
     * ordering also apply here.
     *
     * Emits an {Approval} event.
     *
     * Requirements:
     *
     * - `spender` cannot be the zero address.
     * - `deadline` must be a timestamp in the future.
     * - `v`, `r` and `s` must be a valid `secp256k1` signature from `owner`
     * over the EIP712-formatted function arguments.
     * - the signature must use ``owner``'s current nonce (see {nonces}).
     *
     * For more information on the signature format, see the
     * https://eips.ethereum.org/EIPS/eip-2612#specification[relevant EIP
     * section].
     */
    function permit(
        address owner,
        address spender,
        uint256 value,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external;

    /**
     * @dev Returns the current nonce for `owner`. This value must be
     * included whenever a signature is generated for {permit}.
     *
     * Every successful call to {permit} increases ``owner``'s nonce by one. This
     * prevents a signature from being used multiple times.
     */
    function nonces(address owner) external view returns (uint256);

    /**
     * @dev Returns the domain separator used in the encoding of the signature for {permit}, as defined by {EIP712}.
     */
    // solhint-disable-next-line func-name-mixedcase
    function DOMAIN_SEPARATOR() external view returns (bytes32);
}

// OpenZeppelin Contracts (last updated v4.8.0) (token/ERC20/utils/SafeERC20.sol)

/**
 * @title SafeERC20
 * @dev Wrappers around ERC20 operations that throw on failure (when the token
 * contract returns false). Tokens that return no value (and instead revert or
 * throw on failure) are also supported, non-reverting calls are assumed to be
 * successful.
 * To use this library you can add a `using SafeERC20 for IERC20;` statement to your contract,
 * which allows you to call the safe operations as `token.safeTransfer(...)`, etc.
 */
library SafeERC20 {
    using Address for address;

    function safeTransfer(IERC20 token, address to, uint256 value) internal {
        _callOptionalReturn(token, abi.encodeWithSelector(token.transfer.selector, to, value));
    }

    function safeTransferFrom(IERC20 token, address from, address to, uint256 value) internal {
        _callOptionalReturn(token, abi.encodeWithSelector(token.transferFrom.selector, from, to, value));
    }

    /**
     * @dev Deprecated. This function has issues similar to the ones found in
     * {IERC20-approve}, and its usage is discouraged.
     *
     * Whenever possible, use {safeIncreaseAllowance} and
     * {safeDecreaseAllowance} instead.
     */
    function safeApprove(IERC20 token, address spender, uint256 value) internal {
        // safeApprove should only be called when setting an initial allowance,
        // or when resetting it to zero. To increase and decrease it, use
        // 'safeIncreaseAllowance' and 'safeDecreaseAllowance'
        require(
            (value == 0) || (token.allowance(address(this), spender) == 0),
            "SafeERC20: approve from non-zero to non-zero allowance"
        );
        _callOptionalReturn(token, abi.encodeWithSelector(token.approve.selector, spender, value));
    }

    function safeIncreaseAllowance(IERC20 token, address spender, uint256 value) internal {
        uint256 newAllowance = token.allowance(address(this), spender) + value;
        _callOptionalReturn(token, abi.encodeWithSelector(token.approve.selector, spender, newAllowance));
    }

    function safeDecreaseAllowance(IERC20 token, address spender, uint256 value) internal {
        unchecked {
            uint256 oldAllowance = token.allowance(address(this), spender);
            require(oldAllowance >= value, "SafeERC20: decreased allowance below zero");
            uint256 newAllowance = oldAllowance - value;
            _callOptionalReturn(token, abi.encodeWithSelector(token.approve.selector, spender, newAllowance));
        }
    }

    function safePermit(
        IERC20Permit token,
        address owner,
        address spender,
        uint256 value,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) internal {
        uint256 nonceBefore = token.nonces(owner);
        token.permit(owner, spender, value, deadline, v, r, s);
        uint256 nonceAfter = token.nonces(owner);
        require(nonceAfter == nonceBefore + 1, "SafeERC20: permit did not succeed");
    }

    /**
     * @dev Imitates a Solidity high-level call (i.e. a regular function call to a contract), relaxing the requirement
     * on the return value: the return value is optional (but if data is returned, it must not be false).
     * @param token The token targeted by the call.
     * @param data The call data (encoded using abi.encode or one of its variants).
     */
    function _callOptionalReturn(IERC20 token, bytes memory data) private {
        // We need to perform a low level call here, to bypass Solidity's return data size checking mechanism, since
        // we're implementing it ourselves. We use {Address-functionCall} to perform this call, which verifies that
        // the target address contains contract code and also asserts for success in the low-level call.

        bytes memory returndata = address(token).functionCall(data, "SafeERC20: low-level call failed");
        if (returndata.length > 0) {
            // Return data is optional
            require(abi.decode(returndata, (bool)), "SafeERC20: ERC20 operation did not succeed");
        }
    }
}

// OpenZeppelin Contracts (last updated v4.6.0) (token/ERC20/IERC20.sol)

/**
 * @dev Interface of the ERC20 standard as defined in the EIP.
 */
interface IERC20 {
    /**
     * @dev Emitted when `value` tokens are moved from one account (`from`) to
     * another (`to`).
     *
     * Note that `value` may be zero.
     */
    event Transfer(address indexed from, address indexed to, uint256 value);

    /**
     * @dev Emitted when the allowance of a `spender` for an `owner` is set by
     * a call to {approve}. `value` is the new allowance.
     */
    event Approval(address indexed owner, address indexed spender, uint256 value);

    /**
     * @dev Returns the amount of tokens in existence.
     */
    function totalSupply() external view returns (uint256);

    /**
     * @dev Returns the amount of tokens owned by `account`.
     */
    function balanceOf(address account) external view returns (uint256);

    /**
     * @dev Moves `amount` tokens from the caller's account to `to`.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transfer(address to, uint256 amount) external returns (bool);

    /**
     * @dev Returns the remaining number of tokens that `spender` will be
     * allowed to spend on behalf of `owner` through {transferFrom}. This is
     * zero by default.
     *
     * This value changes when {approve} or {transferFrom} are called.
     */
    function allowance(address owner, address spender) external view returns (uint256);

    /**
     * @dev Sets `amount` as the allowance of `spender` over the caller's tokens.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * IMPORTANT: Beware that changing an allowance with this method brings the risk
     * that someone may use both the old and the new allowance by unfortunate
     * transaction ordering. One possible solution to mitigate this race
     * condition is to first reduce the spender's allowance to 0 and set the
     * desired value afterwards:
     * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
     *
     * Emits an {Approval} event.
     */
    function approve(address spender, uint256 amount) external returns (bool);

    /**
     * @dev Moves `amount` tokens from `from` to `to` using the
     * allowance mechanism. `amount` is then deducted from the caller's
     * allowance.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
}


interface IERC165 {
    /**
     * @dev Returns true if this contract implements the interface defined by
     * `interfaceId`. See the corresponding
     * https://eips.ethereum.org/EIPS/eip-165#how-interfaces-are-identified[EIP section]
     * to learn more about how these ids are created.
     *
     * This function call must use less than 30 000 gas.
     */
    function supportsInterface(bytes4 interfaceId) external view returns (bool);
}

interface IERC721 is IERC165 {
    /**
     * @dev Emitted when `tokenId` token is transferred from `from` to `to`.
     */
    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);

    /**
     * @dev Emitted when `owner` enables `approved` to manage the `tokenId` token.
     */
    event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId);

    /**
     * @dev Emitted when `owner` enables or disables (`approved`) `operator` to manage all of its assets.
     */
    event ApprovalForAll(address indexed owner, address indexed operator, bool approved);

    /**
     * @dev Returns the number of tokens in ``owner``'s account.
     */
    function balanceOf(address owner) external view returns (uint256 balance);

    /**
     * @dev Returns the owner of the `tokenId` token.
     *
     * Requirements:
     *
     * - `tokenId` must exist.
     */
    function ownerOf(uint256 tokenId) external view returns (address owner);

    /**
     * @dev Safely transfers `tokenId` token from `from` to `to`.
     *
     * Requirements:
     *
     * - `from` cannot be the zero address.
     * - `to` cannot be the zero address.
     * - `tokenId` token must exist and be owned by `from`.
     * - If the caller is not `from`, it must be approved to move this token by either {approve} or {setApprovalForAll}.
     * - If `to` refers to a smart contract, it must implement {IERC721Receiver-onERC721Received}, which is called upon a safe transfer.
     *
     * Emits a {Transfer} event.
     */
    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes calldata data
    ) external;

    /**
     * @dev Safely transfers `tokenId` token from `from` to `to`, checking first that contract recipients
     * are aware of the ERC721 protocol to prevent tokens from being forever locked.
     *
     * Requirements:
     *
     * - `from` cannot be the zero address.
     * - `to` cannot be the zero address.
     * - `tokenId` token must exist and be owned by `from`.
     * - If the caller is not `from`, it must have been allowed to move this token by either {approve} or {setApprovalForAll}.
     * - If `to` refers to a smart contract, it must implement {IERC721Receiver-onERC721Received}, which is called upon a safe transfer.
     *
     * Emits a {Transfer} event.
     */
    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) external;

    /**
     * @dev Transfers `tokenId` token from `from` to `to`.
     *
     * WARNING: Usage of this method is discouraged, use {safeTransferFrom} whenever possible.
     *
     * Requirements:
     *
     * - `from` cannot be the zero address.
     * - `to` cannot be the zero address.
     * - `tokenId` token must be owned by `from`.
     * - If the caller is not `from`, it must be approved to move this token by either {approve} or {setApprovalForAll}.
     *
     * Emits a {Transfer} event.
     */
    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) external;

    /**
     * @dev Gives permission to `to` to transfer `tokenId` token to another account.
     * The approval is cleared when the token is transferred.
     *
     * Only a single account can be approved at a time, so approving the zero address clears previous approvals.
     *
     * Requirements:
     *
     * - The caller must own the token or be an approved operator.
     * - `tokenId` must exist.
     *
     * Emits an {Approval} event.
     */
    function approve(address to, uint256 tokenId) external;

    /**
     * @dev Approve or remove `operator` as an operator for the caller.
     * Operators can call {transferFrom} or {safeTransferFrom} for any token owned by the caller.
     *
     * Requirements:
     *
     * - The `operator` cannot be the caller.
     *
     * Emits an {ApprovalForAll} event.
     */
    function setApprovalForAll(address operator, bool _approved) external;

    /**
     * @dev Returns the account approved for `tokenId` token.
     *
     * Requirements:
     *
     * - `tokenId` must exist.
     */
    function getApproved(uint256 tokenId) external view returns (address operator);

    /**
     * @dev Returns if the `operator` is allowed to manage all of the assets of `owner`.
     *
     * See {setApprovalForAll}
     */
    function isApprovedForAll(address owner, address operator) external view returns (bool);
}
// OpenZeppelin Contracts (last updated v4.8.0) (utils/math/Math.sol)
/**
 * @dev Standard math utilities missing in the Solidity language.
 */
library Math {
    enum Rounding {
        Down, // Toward negative infinity
        Up, // Toward infinity
        Zero // Toward zero
    }

    /**
     * @dev Returns the largest of two numbers.
     */
    function max(uint256 a, uint256 b) internal pure returns (uint256) {
        return a > b ? a : b;
    }

    /**
     * @dev Returns the smallest of two numbers.
     */
    function min(uint256 a, uint256 b) internal pure returns (uint256) {
        return a < b ? a : b;
    }

    /**
     * @dev Returns the average of two numbers. The result is rounded towards
     * zero.
     */
    function average(uint256 a, uint256 b) internal pure returns (uint256) {
        // (a + b) / 2 can overflow.
        return (a & b) + (a ^ b) / 2;
    }

    /**
     * @dev Returns the ceiling of the division of two numbers.
     *
     * This differs from standard division with `/` in that it rounds up instead
     * of rounding down.
     */
    function ceilDiv(uint256 a, uint256 b) internal pure returns (uint256) {
        // (a + b - 1) / b can overflow on addition, so we distribute.
        return a == 0 ? 0 : (a - 1) / b + 1;
    }

    /**
     * @notice Calculates floor(x * y / denominator) with full precision. Throws if result overflows a uint256 or denominator == 0
     * @dev Original credit to Remco Bloemen under MIT license (https://xn--2-umb.com/21/muldiv)
     * with further edits by Uniswap Labs also under MIT license.
     */
    function mulDiv(uint256 x, uint256 y, uint256 denominator) internal pure returns (uint256 result) {
        unchecked {
            // 512-bit multiply [prod1 prod0] = x * y. Compute the product mod 2^256 and mod 2^256 - 1, then use
            // use the Chinese Remainder Theorem to reconstruct the 512 bit result. The result is stored in two 256
            // variables such that product = prod1 * 2^256 + prod0.
            uint256 prod0; // Least significant 256 bits of the product
            uint256 prod1; // Most significant 256 bits of the product
            assembly {
                let mm := mulmod(x, y, not(0))
                prod0 := mul(x, y)
                prod1 := sub(sub(mm, prod0), lt(mm, prod0))
            }

            // Handle non-overflow cases, 256 by 256 division.
            if (prod1 == 0) {
                return prod0 / denominator;
            }

            // Make sure the result is less than 2^256. Also prevents denominator == 0.
            require(denominator > prod1, "Math: mulDiv overflow");

            ///////////////////////////////////////////////
            // 512 by 256 division.
            ///////////////////////////////////////////////

            // Make division exact by subtracting the remainder from [prod1 prod0].
            uint256 remainder;
            assembly {
                // Compute remainder using mulmod.
                remainder := mulmod(x, y, denominator)

                // Subtract 256 bit number from 512 bit number.
                prod1 := sub(prod1, gt(remainder, prod0))
                prod0 := sub(prod0, remainder)
            }

            // Factor powers of two out of denominator and compute largest power of two divisor of denominator. Always >= 1.
            // See https://cs.stackexchange.com/q/138556/92363.

            // Does not overflow because the denominator cannot be zero at this stage in the function.
            uint256 twos = denominator & (~denominator + 1);
            assembly {
                // Divide denominator by twos.
                denominator := div(denominator, twos)

                // Divide [prod1 prod0] by twos.
                prod0 := div(prod0, twos)

                // Flip twos such that it is 2^256 / twos. If twos is zero, then it becomes one.
                twos := add(div(sub(0, twos), twos), 1)
            }

            // Shift in bits from prod1 into prod0.
            prod0 |= prod1 * twos;

            // Invert denominator mod 2^256. Now that denominator is an odd number, it has an inverse modulo 2^256 such
            // that denominator * inv = 1 mod 2^256. Compute the inverse by starting with a seed that is correct for
            // four bits. That is, denominator * inv = 1 mod 2^4.
            uint256 inverse = (3 * denominator) ^ 2;

            // Use the Newton-Raphson iteration to improve the precision. Thanks to Hensel's lifting lemma, this also works
            // in modular arithmetic, doubling the correct bits in each step.
            inverse *= 2 - denominator * inverse; // inverse mod 2^8
            inverse *= 2 - denominator * inverse; // inverse mod 2^16
            inverse *= 2 - denominator * inverse; // inverse mod 2^32
            inverse *= 2 - denominator * inverse; // inverse mod 2^64
            inverse *= 2 - denominator * inverse; // inverse mod 2^128
            inverse *= 2 - denominator * inverse; // inverse mod 2^256

            // Because the division is now exact we can divide by multiplying with the modular inverse of denominator.
            // This will give us the correct result modulo 2^256. Since the preconditions guarantee that the outcome is
            // less than 2^256, this is the final result. We don't need to compute the high bits of the result and prod1
            // is no longer required.
            result = prod0 * inverse;
            return result;
        }
    }

    /**
     * @notice Calculates x * y / denominator with full precision, following the selected rounding direction.
     */
    function mulDiv(uint256 x, uint256 y, uint256 denominator, Rounding rounding) internal pure returns (uint256) {
        uint256 result = mulDiv(x, y, denominator);
        if (rounding == Rounding.Up && mulmod(x, y, denominator) > 0) {
            result += 1;
        }
        return result;
    }

    /**
     * @dev Returns the square root of a number. If the number is not a perfect square, the value is rounded down.
     *
     * Inspired by Henry S. Warren, Jr.'s "Hacker's Delight" (Chapter 11).
     */
    function sqrt(uint256 a) internal pure returns (uint256) {
        if (a == 0) {
            return 0;
        }

        // For our first guess, we get the biggest power of 2 which is smaller than the square root of the target.
        //
        // We know that the "msb" (most significant bit) of our target number `a` is a power of 2 such that we have
        // `msb(a) <= a < 2*msb(a)`. This value can be written `msb(a)=2**k` with `k=log2(a)`.
        //
        // This can be rewritten `2**log2(a) <= a < 2**(log2(a) + 1)`
        // → `sqrt(2**k) <= sqrt(a) < sqrt(2**(k+1))`
        // → `2**(k/2) <= sqrt(a) < 2**((k+1)/2) <= 2**(k/2 + 1)`
        //
        // Consequently, `2**(log2(a) / 2)` is a good first approximation of `sqrt(a)` with at least 1 correct bit.
        uint256 result = 1 << (log2(a) >> 1);

        // At this point `result` is an estimation with one bit of precision. We know the true value is a uint128,
        // since it is the square root of a uint256. Newton's method converges quadratically (precision doubles at
        // every iteration). We thus need at most 7 iteration to turn our partial result with one bit of precision
        // into the expected uint128 result.
        unchecked {
            result = (result + a / result) >> 1;
            result = (result + a / result) >> 1;
            result = (result + a / result) >> 1;
            result = (result + a / result) >> 1;
            result = (result + a / result) >> 1;
            result = (result + a / result) >> 1;
            result = (result + a / result) >> 1;
            return min(result, a / result);
        }
    }

    /**
     * @notice Calculates sqrt(a), following the selected rounding direction.
     */
    function sqrt(uint256 a, Rounding rounding) internal pure returns (uint256) {
        unchecked {
            uint256 result = sqrt(a);
            return result + (rounding == Rounding.Up && result * result < a ? 1 : 0);
        }
    }

    /**
     * @dev Return the log in base 2, rounded down, of a positive value.
     * Returns 0 if given 0.
     */
    function log2(uint256 value) internal pure returns (uint256) {
        uint256 result = 0;
        unchecked {
            if (value >> 128 > 0) {
                value >>= 128;
                result += 128;
            }
            if (value >> 64 > 0) {
                value >>= 64;
                result += 64;
            }
            if (value >> 32 > 0) {
                value >>= 32;
                result += 32;
            }
            if (value >> 16 > 0) {
                value >>= 16;
                result += 16;
            }
            if (value >> 8 > 0) {
                value >>= 8;
                result += 8;
            }
            if (value >> 4 > 0) {
                value >>= 4;
                result += 4;
            }
            if (value >> 2 > 0) {
                value >>= 2;
                result += 2;
            }
            if (value >> 1 > 0) {
                result += 1;
            }
        }
        return result;
    }

    /**
     * @dev Return the log in base 2, following the selected rounding direction, of a positive value.
     * Returns 0 if given 0.
     */
    function log2(uint256 value, Rounding rounding) internal pure returns (uint256) {
        unchecked {
            uint256 result = log2(value);
            return result + (rounding == Rounding.Up && 1 << result < value ? 1 : 0);
        }
    }

    /**
     * @dev Return the log in base 10, rounded down, of a positive value.
     * Returns 0 if given 0.
     */
    function log10(uint256 value) internal pure returns (uint256) {
        uint256 result = 0;
        unchecked {
            if (value >= 10 ** 64) {
                value /= 10 ** 64;
                result += 64;
            }
            if (value >= 10 ** 32) {
                value /= 10 ** 32;
                result += 32;
            }
            if (value >= 10 ** 16) {
                value /= 10 ** 16;
                result += 16;
            }
            if (value >= 10 ** 8) {
                value /= 10 ** 8;
                result += 8;
            }
            if (value >= 10 ** 4) {
                value /= 10 ** 4;
                result += 4;
            }
            if (value >= 10 ** 2) {
                value /= 10 ** 2;
                result += 2;
            }
            if (value >= 10 ** 1) {
                result += 1;
            }
        }
        return result;
    }

    /**
     * @dev Return the log in base 10, following the selected rounding direction, of a positive value.
     * Returns 0 if given 0.
     */
    function log10(uint256 value, Rounding rounding) internal pure returns (uint256) {
        unchecked {
            uint256 result = log10(value);
            return result + (rounding == Rounding.Up && 10 ** result < value ? 1 : 0);
        }
    }

    /**
     * @dev Return the log in base 256, rounded down, of a positive value.
     * Returns 0 if given 0.
     *
     * Adding one to the result gives the number of pairs of hex symbols needed to represent `value` as a hex string.
     */
    function log256(uint256 value) internal pure returns (uint256) {
        uint256 result = 0;
        unchecked {
            if (value >> 128 > 0) {
                value >>= 128;
                result += 16;
            }
            if (value >> 64 > 0) {
                value >>= 64;
                result += 8;
            }
            if (value >> 32 > 0) {
                value >>= 32;
                result += 4;
            }
            if (value >> 16 > 0) {
                value >>= 16;
                result += 2;
            }
            if (value >> 8 > 0) {
                result += 1;
            }
        }
        return result;
    }

    /**
     * @dev Return the log in base 256, following the selected rounding direction, of a positive value.
     * Returns 0 if given 0.
     */
    function log256(uint256 value, Rounding rounding) internal pure returns (uint256) {
        unchecked {
            uint256 result = log256(value);
            return result + (rounding == Rounding.Up && 1 << (result << 3) < value ? 1 : 0);
        }
    }
}

// OpenZeppelin Contracts (last updated v4.8.0) (utils/math/SignedMath.sol)
/**
 * @dev Standard signed math utilities missing in the Solidity language.
 */
library SignedMath {
    /**
     * @dev Returns the largest of two signed numbers.
     */
    function max(int256 a, int256 b) internal pure returns (int256) {
        return a > b ? a : b;
    }

    /**
     * @dev Returns the smallest of two signed numbers.
     */
    function min(int256 a, int256 b) internal pure returns (int256) {
        return a < b ? a : b;
    }

    /**
     * @dev Returns the average of two signed numbers without overflow.
     * The result is rounded towards zero.
     */
    function average(int256 a, int256 b) internal pure returns (int256) {
        // Formula from the book "Hacker's Delight"
        int256 x = (a & b) + ((a ^ b) >> 1);
        return x + (int256(uint256(x) >> 255) & (a ^ b));
    }

    /**
     * @dev Returns the absolute unsigned value of a signed value.
     */
    function abs(int256 n) internal pure returns (uint256) {
        unchecked {
            // must be unchecked in order to support `n = type(int256).min`
            return uint256(n >= 0 ? n : -n);
        }
    }
}

// OpenZeppelin Contracts (last updated v4.6.0) (utils/math/SafeMath.sol)
// CAUTION
// This version of SafeMath should only be used with Solidity 0.8 or later,
// because it relies on the compiler's built in overflow checks.

/**
 * @dev Wrappers over Solidity's arithmetic operations.
 *
 * NOTE: `SafeMath` is generally not needed starting with Solidity 0.8, since the compiler
 * now has built in overflow checking.
 */
library SafeMath {
    /**
     * @dev Returns the addition of two unsigned integers, with an overflow flag.
     *
     * _Available since v3.4._
     */
    function tryAdd(uint256 a, uint256 b) internal pure returns (bool, uint256) {
        unchecked {
            uint256 c = a + b;
            if (c < a) return (false, 0);
            return (true, c);
        }
    }

    /**
     * @dev Returns the subtraction of two unsigned integers, with an overflow flag.
     *
     * _Available since v3.4._
     */
    function trySub(uint256 a, uint256 b) internal pure returns (bool, uint256) {
        unchecked {
            if (b > a) return (false, 0);
            return (true, a - b);
        }
    }

    /**
     * @dev Returns the multiplication of two unsigned integers, with an overflow flag.
     *
     * _Available since v3.4._
     */
    function tryMul(uint256 a, uint256 b) internal pure returns (bool, uint256) {
        unchecked {
            // Gas optimization: this is cheaper than requiring 'a' not being zero, but the
            // benefit is lost if 'b' is also tested.
            // See: https://github.com/OpenZeppelin/openzeppelin-contracts/pull/522
            if (a == 0) return (true, 0);
            uint256 c = a * b;
            if (c / a != b) return (false, 0);
            return (true, c);
        }
    }

    /**
     * @dev Returns the division of two unsigned integers, with a division by zero flag.
     *
     * _Available since v3.4._
     */
    function tryDiv(uint256 a, uint256 b) internal pure returns (bool, uint256) {
        unchecked {
            if (b == 0) return (false, 0);
            return (true, a / b);
        }
    }

    /**
     * @dev Returns the remainder of dividing two unsigned integers, with a division by zero flag.
     *
     * _Available since v3.4._
     */
    function tryMod(uint256 a, uint256 b) internal pure returns (bool, uint256) {
        unchecked {
            if (b == 0) return (false, 0);
            return (true, a % b);
        }
    }

    /**
     * @dev Returns the addition of two unsigned integers, reverting on
     * overflow.
     *
     * Counterpart to Solidity's `+` operator.
     *
     * Requirements:
     *
     * - Addition cannot overflow.
     */
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        return a + b;
    }

    /**
     * @dev Returns the subtraction of two unsigned integers, reverting on
     * overflow (when the result is negative).
     *
     * Counterpart to Solidity's `-` operator.
     *
     * Requirements:
     *
     * - Subtraction cannot overflow.
     */
    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        return a - b;
    }

    /**
     * @dev Returns the multiplication of two unsigned integers, reverting on
     * overflow.
     *
     * Counterpart to Solidity's `*` operator.
     *
     * Requirements:
     *
     * - Multiplication cannot overflow.
     */
    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        return a * b;
    }

    /**
     * @dev Returns the integer division of two unsigned integers, reverting on
     * division by zero. The result is rounded towards zero.
     *
     * Counterpart to Solidity's `/` operator.
     *
     * Requirements:
     *
     * - The divisor cannot be zero.
     */
    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        return a / b;
    }

    /**
     * @dev Returns the remainder of dividing two unsigned integers. (unsigned integer modulo),
     * reverting when dividing by zero.
     *
     * Counterpart to Solidity's `%` operator. This function uses a `revert`
     * opcode (which leaves remaining gas untouched) while Solidity uses an
     * invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     *
     * - The divisor cannot be zero.
     */
    function mod(uint256 a, uint256 b) internal pure returns (uint256) {
        return a % b;
    }

    /**
     * @dev Returns the subtraction of two unsigned integers, reverting with custom message on
     * overflow (when the result is negative).
     *
     * CAUTION: This function is deprecated because it requires allocating memory for the error
     * message unnecessarily. For custom revert reasons use {trySub}.
     *
     * Counterpart to Solidity's `-` operator.
     *
     * Requirements:
     *
     * - Subtraction cannot overflow.
     */
    function sub(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
        unchecked {
            require(b <= a, errorMessage);
            return a - b;
        }
    }

    /**
     * @dev Returns the integer division of two unsigned integers, reverting with custom message on
     * division by zero. The result is rounded towards zero.
     *
     * Counterpart to Solidity's `/` operator. Note: this function uses a
     * `revert` opcode (which leaves remaining gas untouched) while Solidity
     * uses an invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     *
     * - The divisor cannot be zero.
     */
    function div(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
        unchecked {
            require(b > 0, errorMessage);
            return a / b;
        }
    }

    /**
     * @dev Returns the remainder of dividing two unsigned integers. (unsigned integer modulo),
     * reverting with custom message when dividing by zero.
     *
     * CAUTION: This function is deprecated because it requires allocating memory for the error
     * message unnecessarily. For custom revert reasons use {tryMod}.
     *
     * Counterpart to Solidity's `%` operator. This function uses a `revert`
     * opcode (which leaves remaining gas untouched) while Solidity uses an
     * invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     *
     * - The divisor cannot be zero.
     */
    function mod(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
        unchecked {
            require(b > 0, errorMessage);
            return a % b;
        }
    }
}

// OpenZeppelin Contracts (last updated v4.8.0) (utils/Address.sol)
/**
 * @dev Collection of functions related to the address type
 */
library Address {
    /**
     * @dev Returns true if `account` is a contract.
     *
     * [IMPORTANT]
     * ====
     * It is unsafe to assume that an address for which this function returns
     * false is an externally-owned account (EOA) and not a contract.
     *
     * Among others, `isContract` will return false for the following
     * types of addresses:
     *
     *  - an externally-owned account
     *  - a contract in construction
     *  - an address where a contract will be created
     *  - an address where a contract lived, but was destroyed
     *
     * Furthermore, `isContract` will also return true if the target contract within
     * the same transaction is already scheduled for destruction by `SELFDESTRUCT`,
     * which only has an effect at the end of a transaction.
     * ====
     *
     * [IMPORTANT]
     * ====
     * You shouldn't rely on `isContract` to protect against flash loan attacks!
     *
     * Preventing calls from contracts is highly discouraged. It breaks composability, breaks support for smart wallets
     * like Gnosis Safe, and does not provide security since it can be circumvented by calling from a contract
     * constructor.
     * ====
     */
    function isContract(address account) internal view returns (bool) {
        // This method relies on extcodesize/address.code.length, which returns 0
        // for contracts in construction, since the code is only stored at the end
        // of the constructor execution.

        return account.code.length > 0;
    }

    /**
     * @dev Replacement for Solidity's `transfer`: sends `amount` wei to
     * `recipient`, forwarding all available gas and reverting on errors.
     *
     * https://eips.ethereum.org/EIPS/eip-1884[EIP1884] increases the gas cost
     * of certain opcodes, possibly making contracts go over the 2300 gas limit
     * imposed by `transfer`, making them unable to receive funds via
     * `transfer`. {sendValue} removes this limitation.
     *
     * https://consensys.net/diligence/blog/2019/09/stop-using-soliditys-transfer-now/[Learn more].
     *
     * IMPORTANT: because control is transferred to `recipient`, care must be
     * taken to not create reentrancy vulnerabilities. Consider using
     * {ReentrancyGuard} or the
     * https://solidity.readthedocs.io/en/v0.5.11/security-considerations.html#use-the-checks-effects-interactions-pattern[checks-effects-interactions pattern].
     */
    function sendValue(address payable recipient, uint256 amount) internal {
        require(address(this).balance >= amount, "Address: insufficient balance");

        (bool success, ) = recipient.call{value: amount}("");
        require(success, "Address: unable to send value, recipient may have reverted");
    }

    /**
     * @dev Performs a Solidity function call using a low level `call`. A
     * plain `call` is an unsafe replacement for a function call: use this
     * function instead.
     *
     * If `target` reverts with a revert reason, it is bubbled up by this
     * function (like regular Solidity function calls).
     *
     * Returns the raw returned data. To convert to the expected return value,
     * use https://solidity.readthedocs.io/en/latest/units-and-global-variables.html?highlight=abi.decode#abi-encoding-and-decoding-functions[`abi.decode`].
     *
     * Requirements:
     *
     * - `target` must be a contract.
     * - calling `target` with `data` must not revert.
     *
     * _Available since v3.1._
     */
    function functionCall(address target, bytes memory data) internal returns (bytes memory) {
        return functionCallWithValue(target, data, 0, "Address: low-level call failed");
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`], but with
     * `errorMessage` as a fallback revert reason when `target` reverts.
     *
     * _Available since v3.1._
     */
    function functionCall(
        address target,
        bytes memory data,
        string memory errorMessage
    ) internal returns (bytes memory) {
        return functionCallWithValue(target, data, 0, errorMessage);
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`],
     * but also transferring `value` wei to `target`.
     *
     * Requirements:
     *
     * - the calling contract must have an ETH balance of at least `value`.
     * - the called Solidity function must be `payable`.
     *
     * _Available since v3.1._
     */
    function functionCallWithValue(address target, bytes memory data, uint256 value) internal returns (bytes memory) {
        return functionCallWithValue(target, data, value, "Address: low-level call with value failed");
    }

    /**
     * @dev Same as {xref-Address-functionCallWithValue-address-bytes-uint256-}[`functionCallWithValue`], but
     * with `errorMessage` as a fallback revert reason when `target` reverts.
     *
     * _Available since v3.1._
     */
    function functionCallWithValue(
        address target,
        bytes memory data,
        uint256 value,
        string memory errorMessage
    ) internal returns (bytes memory) {
        require(address(this).balance >= value, "Address: insufficient balance for call");
        (bool success, bytes memory returndata) = target.call{value: value}(data);
        return verifyCallResultFromTarget(target, success, returndata, errorMessage);
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`],
     * but performing a static call.
     *
     * _Available since v3.3._
     */
    function functionStaticCall(address target, bytes memory data) internal view returns (bytes memory) {
        return functionStaticCall(target, data, "Address: low-level static call failed");
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-string-}[`functionCall`],
     * but performing a static call.
     *
     * _Available since v3.3._
     */
    function functionStaticCall(
        address target,
        bytes memory data,
        string memory errorMessage
    ) internal view returns (bytes memory) {
        (bool success, bytes memory returndata) = target.staticcall(data);
        return verifyCallResultFromTarget(target, success, returndata, errorMessage);
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`],
     * but performing a delegate call.
     *
     * _Available since v3.4._
     */
    function functionDelegateCall(address target, bytes memory data) internal returns (bytes memory) {
        return functionDelegateCall(target, data, "Address: low-level delegate call failed");
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-string-}[`functionCall`],
     * but performing a delegate call.
     *
     * _Available since v3.4._
     */
    function functionDelegateCall(
        address target,
        bytes memory data,
        string memory errorMessage
    ) internal returns (bytes memory) {
        (bool success, bytes memory returndata) = target.delegatecall(data);
        return verifyCallResultFromTarget(target, success, returndata, errorMessage);
    }

    /**
     * @dev Tool to verify that a low level call to smart-contract was successful, and revert (either by bubbling
     * the revert reason or using the provided one) in case of unsuccessful call or if target was not a contract.
     *
     * _Available since v4.8._
     */
    function verifyCallResultFromTarget(
        address target,
        bool success,
        bytes memory returndata,
        string memory errorMessage
    ) internal view returns (bytes memory) {
        if (success) {
            if (returndata.length == 0) {
                // only check isContract if the call was successful and the return data is empty
                // otherwise we already know that it was a contract
                require(isContract(target), "Address: call to non-contract");
            }
            return returndata;
        } else {
            _revert(returndata, errorMessage);
        }
    }

    /**
     * @dev Tool to verify that a low level call was successful, and revert if it wasn't, either by bubbling the
     * revert reason or using the provided one.
     *
     * _Available since v4.3._
     */
    function verifyCallResult(
        bool success,
        bytes memory returndata,
        string memory errorMessage
    ) internal pure returns (bytes memory) {
        if (success) {
            return returndata;
        } else {
            _revert(returndata, errorMessage);
        }
    }

    function _revert(bytes memory returndata, string memory errorMessage) private pure {
        // Look for revert reason and bubble it up if present
        if (returndata.length > 0) {
            // The easiest way to bubble the revert reason is using memory via assembly
            /// @solidity memory-safe-assembly
            assembly {
                let returndata_size := mload(returndata)
                revert(add(32, returndata), returndata_size)
            }
        } else {
            revert(errorMessage);
        }
    }
}

/**
 * @dev Contract module which allows children to implement an emergency stop
 * mechanism that can be triggered by an authorized account.
 *
 * This module is used through inheritance. It will make available the
 * modifiers `whenNotPaused` and `whenPaused`, which can be applied to
 * the functions of your contract. Note that they will not be pausable by
 * simply including this module, only once the modifiers are put in place.
 */
abstract contract Pausable is Context {
    /**
     * @dev Emitted when the pause is triggered by `account`.
     */
    event Paused(address account);

    /**
     * @dev Emitted when the pause is lifted by `account`.
     */
    event Unpaused(address account);

    bool private _paused;

    /**
     * @dev Initializes the contract in unpaused state.
     */
    constructor () {
        _paused = false;
    }

    /**
     * @dev Returns true if the contract is paused, and false otherwise.
     */
    function paused() public view virtual returns (bool) {
        return _paused;
    }

    /**
     * @dev Modifier to make a function callable only when the contract is not paused.
     *
     * Requirements:
     *
     * - The contract must not be paused.
     */
    modifier whenNotPaused() {
        require(!paused(), "Pausable: paused");
        _;
    }

    /**
     * @dev Modifier to make a function callable only when the contract is paused.
     *
     * Requirements:
     *
     * - The contract must be paused.
     */
    modifier whenPaused() {
        require(paused(), "Pausable: not paused");
        _;
    }

    /**
     * @dev Triggers stopped state.
     *
     * Requirements:
     *
     * - The contract must not be paused.
     */
    function _pause() internal virtual whenNotPaused {
        _paused = true;
        emit Paused(_msgSender());
    }

    /**
     * @dev Returns to normal state.
     *
     * Requirements:
     *
     * - The contract must be paused.
     */
    function _unpause() internal virtual whenPaused {
        _paused = false;
        emit Unpaused(_msgSender());
    }
}

contract Marketplace is Ownable, Pausable {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    uint8 public constant STATUS_OPEN = 1;
    uint8 public constant STATUS_DONE = 2;

    uint256 public minAuctionIncrement = 10; // 10 percent
    uint256 public bidAddTimer = 3600; // 1hour
    uint256 public offersCounter;

    function setMinAuctionIncrement(uint256 _val) public onlyOwner {
        minAuctionIncrement = _val;
    }
    function setBidAddTimer(uint256 _val) public onlyOwner {
        bidAddTimer = _val;
    }

    struct SelledNFT {
        uint256 offerId;
        address collection; // NFT коллекция
        uint256 tokenId;    // ID токена
        address seller;     // Продавец
        uint256 price;      // Цена (wei)
        address erc20;      // Если указано - продается за токены
        uint256 utx;        // Время истечения лота (0 - бессрочный)
        bool isBitable;     // Аукцион
        uint256 netPrice;   // Актуальная цена
        uint256 endAt;      // Время истечения аукциона
        uint8 status;       // Статус
    }

    struct CollectionTokenCount {
        address collection;
        uint256 count;
    }

    uint constant public version = 1;

    uint private _tradeFee = 0;

    function isMarketPlaceContract() public pure returns (bool) {
        return true;
    }

    IERC721[] private _marketCollections;
    mapping(address => bool) private _allowedCollections;

    address[] private _allowedERC20;

    address[] private _manySellAllowed;

    SelledNFT[] private _marketTokens;

    /* Collection => Tokens */
    mapping(address => SelledNFT[]) private _collectionTokens;
    /* Seller => Tokens */
    mapping(address => SelledNFT[]) private _userTokens;
    /* Seller => Collection => Tokens */
    mapping(address => mapping(address => SelledNFT[])) private _userTokensByCollections;
    /* Collection => TokenId => LotInfo */
    mapping(address => mapping(uint256 => SelledNFT)) private _collectionTokensMap;

    // Аукцион
    mapping(uint256 => SelledNFT) public _auctionListedNfts;

    function getAuctionOffer(uint256 offerId) public view returns(SelledNFT memory) {
        return _auctionListedNfts[offerId];
    }

    mapping(uint256 => mapping(address => uint256)) public bids;
    mapping(uint256 => address) public highestBidder;
    mapping(address => uint256[]) public userAuctions;
    mapping(uint256 => address[]) public bidsOwners;
    struct BidOwner {
        address owner;
        uint256 bid;
    }
    function getOfferBids(uint256 offerId) public view returns(BidOwner[] memory ret) {
        ret = new BidOwner[](bidsOwners[offerId].length);
        for(uint256 i = 0; i < bidsOwners[offerId].length; i++) {
            ret[i] = BidOwner({
                owner: bidsOwners[offerId][i],
                bid: bids[offerId][bidsOwners[offerId][i]]
            });
        }
    }

    function getUserAuctions(address user) public view returns(SelledNFT[] memory ret) {
        ret = new SelledNFT[](userAuctions[user].length);
        for(uint256 i = 0; i < userAuctions[user].length; i++) {
            ret[i] = _auctionListedNfts[userAuctions[user][ userAuctions[user].length - i - 1]];
        }
    }
    address private _feeReceiver;

    function _marketTokensAdd(SelledNFT memory lotInfo) internal {
        _marketTokens.push(lotInfo);
        _collectionTokensMap[lotInfo.collection][lotInfo.tokenId] = lotInfo;
        _userTokens[lotInfo.seller].push(lotInfo);
        _collectionTokens[lotInfo.collection].push(lotInfo);
        _userTokensByCollections[lotInfo.seller][lotInfo.collection].push(lotInfo);
    }

    function _marketTokensDel(address collection, uint256 tokenId) internal {
        if (
            (_marketTokens[_marketTokens.length - 1].collection == collection)
            &&
            (_marketTokens[_marketTokens.length - 1].tokenId == tokenId)
        ) {
            delete _collectionTokensMap[collection][tokenId];
            _marketTokens.pop();
        }
        for(uint256 i = 0; i < _marketTokens.length; i++) {
            if (
                (_marketTokens[i].collection == collection)
                &&
                (_marketTokens[i].tokenId == tokenId)
            ) {
                _marketTokens[i] = _marketTokens[
                    _marketTokens.length -1
                ];
                delete _collectionTokensMap[collection][tokenId];
                _marketTokens.pop();
                return;
            }
        }
    }
    function _userTokensDel(address seller, address collection, uint256 tokenId) internal {
        if (
            (   
                _userTokens[seller][
                    _userTokens[seller].length - 1
                ].collection == collection
            ) && (
                _userTokens[seller][
                    _userTokens[seller].length - 1
                ].tokenId == tokenId
            )
        ) {
            _userTokens[seller].pop();
        }
        for(uint256 i = 0; i < _userTokens[seller].length; i++) {
            if (
                (_userTokens[seller][i].collection == collection)
                &&
                (_userTokens[seller][i].tokenId == tokenId)
            ) {
                _userTokens[seller][i] = _userTokens[seller][
                    _userTokens[seller].length -1
                ];
                _userTokens[seller].pop();
                return;
            }
        }
    }
    function _userTokensByCollectionsDel(address seller, address collection, uint256 tokenId) internal {
        if (_userTokensByCollections[seller][collection][
                _userTokensByCollections[seller][collection].length - 1
            ].tokenId == tokenId) {
            _userTokensByCollections[seller][collection].pop();
        }
        for(uint256 i = 0; i < _userTokensByCollections[seller][collection].length; i++) {
            if (_userTokensByCollections[seller][collection][i].tokenId == tokenId) {
                _userTokensByCollections[seller][collection][i] = _userTokensByCollections[seller][collection][
                    _userTokensByCollections[seller][collection].length -1
                ];
                _userTokensByCollections[seller][collection].pop();
                return;
            }
        }
    }
    function _collectionTokensDel(address collection, uint256 tokenId) internal {
        if (
            _collectionTokens[collection][
                _collectionTokens[collection].length - 1
            ].tokenId == tokenId
        ) {
            _collectionTokens[collection].pop();
        }
        for(uint256 i = 0; i < _collectionTokens[collection].length; i++) {
            if (_collectionTokens[collection][i].tokenId == tokenId) {
                _collectionTokens[collection][i] = _collectionTokens[collection][
                    _collectionTokens[collection].length -1
                ];
                _collectionTokens[collection].pop();
                return;
            }
        }
    }
    
    function _sliceTokensList(SelledNFT[] memory _tokens, uint256 offset, uint256 limit) 
        internal view 
        returns(SelledNFT[] memory ret)
    {
        if (offset >= _tokens.length) return ret;
        if ((offset == 0) && (limit == 0)) {
            limit = _tokens.length;
        }
        uint256 iEnd = offset + limit;
        if (iEnd > _tokens.length) iEnd = _tokens.length;
        ret = new SelledNFT[](iEnd - offset);
        
        for(uint256 i = 0; i < iEnd-offset; i++) {
            ret[i] = _collectionTokensMap[
                _tokens[ _tokens.length - i - offset - 1].collection
            ][
                _tokens[ _tokens.length - i - offset - 1].tokenId
            ];
        }
        return ret;
    }

    constructor(
        address[] memory __collections,
        address __feeReceiver,
        uint __tradeFee,
        address[] memory __allowedERC20
    ) {
        for(uint i = 0; i < __collections.length; i++) {
            _allowedCollections[__collections[i]] = true;
            _marketCollections.push(IERC721(__collections[i]));
        }
        _feeReceiver = (__feeReceiver == address(0)) ? msg.sender : __feeReceiver;
        _tradeFee = __tradeFee;
        _allowedERC20 = __allowedERC20;
    }

    function getFeeReceiver() public view returns(address) {
        return _feeReceiver;
    }
    function setFeeReceiver(address _newFeeReceiver) public onlyOwner {
        _feeReceiver = _newFeeReceiver;
    }

    function getAllowedCollections() public view returns(IERC721[] memory) {
        return _marketCollections;
    }

    function setAllowedCollections(address[] memory _newCollections) public onlyOwner {
        for(uint256 i = 0; i < _marketCollections.length; i++) {
            _allowedCollections[address(_marketCollections[i])] = false;
        }
        delete _marketCollections;
        for(uint256 i = 0; i < _newCollections.length; i++) {
            _marketCollections.push(IERC721(_newCollections[i]));
            _allowedCollections[_newCollections[i]] = true;
        }
    }

    function setAllowedERC20(address[] memory newAllowedERC20) public onlyOwner {
        _allowedERC20 = newAllowedERC20;
    }
    
    function getAllowedERC20() public view returns(address[] memory) {
        return _allowedERC20;
    }

    function isAllowedERC20(address erc20) public view returns (bool) {
        for(uint256 i=0; i<_allowedERC20.length;i++) {
            if (erc20 == _allowedERC20[i]) return true;
        }
        return false;
    }

    function withdrawNative(uint256 amount) public onlyOwner {
        (bool success, ) = owner().call{value: amount}("");
    }

    function withdrawERC20(address erc20) public onlyOwner {
        IERC20 token = IERC20(erc20);
        uint256 balance = token.balanceOf(address(this));
        token.transfer(owner(), balance);
    }

    function getTradeFee() public view returns (uint) {
        return _tradeFee;
    }

    function setTradeFee(uint _newTradeFee) public onlyOwner {
        _tradeFee = _newTradeFee;
    }

    function getColletionTokensCount(address collection) public view returns (uint256) {
        return _collectionTokens[collection].length;
    }

    function getUserCollectionTokensCount(address seller, address collection) public view returns(uint256) {
        return _userTokensByCollections[seller][collection].length;
    }
    
    function getCollectionsTokensCount() public view returns (CollectionTokenCount[] memory ret) {
        ret = new CollectionTokenCount[](_marketCollections.length);
        for(uint256 i = 0; i < _marketCollections.length; i++) {
            ret[i] = CollectionTokenCount(
                address(_marketCollections[i]),
                _collectionTokens[address(_marketCollections[i])].length
            );
        }
        return ret;
    }

    function getUserCollectionsTokenCount(address seller) public view returns(CollectionTokenCount[] memory ret) {
        ret = new CollectionTokenCount[](_marketCollections.length);
        for(uint256 i = 0; i < _marketCollections.length; i++) {
            ret[i] = CollectionTokenCount(
                address(_marketCollections[i]),
                _userTokensByCollections[seller][address(_marketCollections[i])].length
            );
        }
        return ret;
    }

    function marketTokensGet(address collection, uint256 tokenId) public view returns (SelledNFT memory ret) {
        return _collectionTokensMap[collection][tokenId];
    }

    function getMyTokensAtSale(uint256 offset, uint256 limit) public view returns(SelledNFT[] memory) {
        return getUserTokensAtSale(msg.sender, offset, limit);
    }

    function getUserTokensAtSale(address seller, uint256 offset, uint256 limit)
        public view
        returns (SelledNFT[] memory ret)
    {
        return _sliceTokensList(
            _userTokens[seller], offset, limit
        );
    }

    function getUserCollectionTokensAtSale(address seller, address collection, uint256 offset, uint256 limit)
        public view 
        returns (SelledNFT[] memory ret)
    {
        return _sliceTokensList(
            _userTokensByCollections[seller][collection],
            offset,
            limit
        );
    }

    function getTokensAtSaleCount() public view returns (uint256) {
        return _marketTokens.length;
    }

    function getTokensAtSale(uint256 offset, uint256 limit) public view returns (SelledNFT[] memory _ret) {
        return _sliceTokensList(
            _marketTokens, offset, limit
        );
    }

    function getCollectionTokensAtSale(address collection, uint256 offset, uint256 limit) public view returns (SelledNFT[] memory ret) {
        return _sliceTokensList(
            _collectionTokens[collection], offset, limit
        );
    }

    function bid(uint256 offerId, uint256 amount)
        public
        payable
        whenNotPaused
    {
        require(isAuctionOpen(offerId), "auction has ended");
        SelledNFT memory lotInfo = _auctionListedNfts[offerId];
        require(lotInfo.collection != address(0), "This NFT is not for sale");
        require(lotInfo.isBitable == true, "This NFT only buy with fix price");

        require(msg.sender != lotInfo.seller, "cannot bid on what you own");
        IERC20 payToken = IERC20(lotInfo.erc20);

        uint256 _amount = (lotInfo.erc20 == address(0)) ? msg.value : amount;
        if (lotInfo.erc20 != address(0)) {
            uint256 buyerBalance = payToken.balanceOf(msg.sender);
            require(buyerBalance >= _amount, "You do not have enough tokens on your balance to pay");
            uint256 buyerAllowance = payToken.allowance(msg.sender, address(this));
            require(buyerAllowance >= _amount, "You did not allow the contract to send the purchase amount");
        }
        uint256 newBid = bids[offerId][msg.sender] + _amount;
        require(newBid >= lotInfo.price, "cannot bid below the latest bidding price");

        if (bids[offerId][msg.sender] == 0) {
            bidsOwners[offerId].push(msg.sender);
            userAuctions[msg.sender].push(offerId);
        }
        bids[offerId][msg.sender] += _amount;
        if (lotInfo.erc20 != address(0)) {
            payToken.safeTransferFrom(
                address(msg.sender),
                address(this),
                _amount
            );
        }
        highestBidder[offerId] = msg.sender;

        uint256 incentive = SafeMath.mul(SafeMath.div(lotInfo.price, 100), minAuctionIncrement);
        lotInfo.price = newBid + incentive;
        lotInfo.endAt = block.timestamp + bidAddTimer;
        _auctionListedNfts[offerId] = lotInfo;
        _collectionTokensMap[lotInfo.collection][lotInfo.tokenId] = lotInfo;
    }

    function _processPay(address payer, SelledNFT memory lotInfo, uint256 amount) private {
        uint256 feeAmount = SafeMath.mul(SafeMath.div(amount, 100), _tradeFee);
        if (lotInfo.seller == owner()) feeAmount = 0;
        uint256 amountWithFee = SafeMath.sub(amount, feeAmount);

        if (lotInfo.erc20 == address(0)) {
            payable(lotInfo.seller).transfer(amountWithFee);
            if (feeAmount > 0) {
                payable(_feeReceiver).transfer(feeAmount);
            }
        } else {
            IERC20 payToken = IERC20(lotInfo.erc20);
            if (payer == address(this)) {
                payToken.transfer(
                    address(lotInfo.seller),
                    amountWithFee
                );
                if (feeAmount > 0) {
                    payToken.transfer(
                        address(_feeReceiver),
                        feeAmount
                    );
                }
            } else {
                payToken.transferFrom(
                    payer,
                    address(lotInfo.seller),
                    amountWithFee
                );
                if (feeAmount > 0) {
                    payToken.transferFrom(
                        payer,
                        address(_feeReceiver),
                        feeAmount
                    );
                }
            }
        }
    }
    function completeAuction(uint256 offerId) public payable {
        require(!isAuctionOpen(offerId), 'auction is still open');

        SelledNFT storage lotInfo = _auctionListedNfts[offerId];
        address winner = highestBidder[offerId]; 
        require(
            msg.sender == lotInfo.seller || msg.sender == winner, 
            'only seller or winner can complete auction'
        );

        if(winner != address(0)) {
            uint256 amount = bids[offerId][winner]; 
            bids[offerId][winner] = 0;
            _processPay(address(this), lotInfo, amount);
            
            IERC721(lotInfo.collection).transferFrom(address(this), winner, lotInfo.tokenId);
        } else {
            IERC721(lotInfo.collection).transferFrom(address(this), lotInfo.seller, lotInfo.tokenId);
        }
        // Delete offer from shop list
        lotInfo.status = STATUS_DONE;
        _deleteLotFromShop(lotInfo);
    }

    function withdrawBid(uint256 offerId) public payable {
        require(isAuctionExpired(offerId), 'auction must be ended');
        require(highestBidder[offerId] != msg.sender, 'highest bidder cannot withdraw bid');

        SelledNFT memory lotInfo = _auctionListedNfts[offerId];
        uint256 balance = bids[offerId][msg.sender];
        bids[offerId][msg.sender] = 0;
        if (lotInfo.erc20 == address(0)) {
            payable(msg.sender).transfer(balance);
        } else {
            IERC20 payToken = IERC20(lotInfo.erc20);
            payToken.transfer(
                address(msg.sender),
                balance
            );
        }
    }
    function isAuctionOpen(uint256 offerId) public view returns (bool) {
        SelledNFT memory lotInfo = _auctionListedNfts[offerId];
        return
            lotInfo.status == STATUS_OPEN &&
            lotInfo.endAt > block.timestamp;
    }

    function isAuctionExpired(uint256 offerId) public view returns (bool) {
        SelledNFT memory lotInfo = _auctionListedNfts[offerId];
        return lotInfo.endAt <= block.timestamp;
    }

    function buyNFT(address collection, uint256 tokenId)
        public
        payable
        whenNotPaused
    {
        SelledNFT memory lotInfo = marketTokensGet(collection, tokenId);
        require( lotInfo.collection != address(0), "This NFT is not for sale");
        require(lotInfo.isBitable == false, "This NFT for auction only");
        // check - price
        IERC20 payToken = IERC20(lotInfo.erc20);
        

        if (lotInfo.erc20 == address(0)) {
            require(msg.value >= lotInfo.price, "You have not paid enough for this item");
        } else {
            uint256 buyerBalance = payToken.balanceOf(msg.sender);
            require(buyerBalance >= lotInfo.price, "You do not have enough tokens on your balance to pay");
            uint256 buyerAllowance = payToken.allowance(msg.sender, address(this));
            require(buyerAllowance >= lotInfo.price, "You did not allow the contract to send the purchase amount");
        }
        
        uint256 amount = (lotInfo.erc20 == address(0)) ? msg.value : lotInfo.price;
        _processPay(msg.sender, lotInfo, amount);

        
        IERC721(lotInfo.collection).transferFrom(address(this), msg.sender, lotInfo.tokenId);
        
        _deleteLotFromShop(lotInfo);
    }

    function _deleteLotFromShop(SelledNFT memory lotInfo) private {
        _marketTokensDel(lotInfo.collection, lotInfo.tokenId);
        _userTokensDel(lotInfo.seller, lotInfo.collection, lotInfo.tokenId);
        _collectionTokensDel(lotInfo.collection, lotInfo.tokenId);
        _userTokensByCollectionsDel(lotInfo.seller, lotInfo.collection, lotInfo.tokenId);
    }

    function sellNFT(
        address collection,
        uint256 _tokenId,
        uint256 price,
        address _erc20,
        bool isAuction,
        uint256 durationInSeconds
    )
        public
        whenNotPaused
    {
        // Check collection allowed
        require(
            _allowedCollections[collection],
            "Not allowed NFT collection"
        );
        // Check owner
        require(
            IERC721(collection).ownerOf(_tokenId) == msg.sender,
            "You don't own this token!"
        );
        require(price > 0, "Price must be greater than zero");
        if (_erc20 != address(0)) {
            // Sell with ERC20
            require(isAllowedERC20(_erc20) == true, "This ERC20 not allowed as a trading currency");
        }
        if (isAuction) {
            offersCounter++;
        }

        SelledNFT memory newLot = SelledNFT(
            (isAuction) ? offersCounter : 0,
            collection,
            _tokenId,
            msg.sender,
            price,
            _erc20,
            block.timestamp,
            isAuction,
            price,
            block.timestamp + durationInSeconds,
            STATUS_OPEN
        );
        IERC721(collection).transferFrom(msg.sender, address(this), _tokenId);
        _marketTokensAdd(newLot);
        if (isAuction) {
            _auctionListedNfts[offersCounter] = newLot;
            userAuctions[msg.sender].push(offersCounter);
        }
    }

    function deSellNFT(address collection, uint256 tokenId) public {
        SelledNFT memory lotInfo = marketTokensGet(collection, tokenId);
        require( lotInfo.collection != address(0), "Token not founded at marketplace");
        if(msg.sender != owner()) {
            require(msg.sender == lotInfo.seller, "This is not your NFT");
        }
        IERC721(lotInfo.collection).transferFrom(address(this), lotInfo.seller, lotInfo.tokenId);

        _marketTokensDel(lotInfo.collection, lotInfo.tokenId);
        _userTokensDel(lotInfo.seller, lotInfo.collection, lotInfo.tokenId);
        _collectionTokensDel(lotInfo.collection, lotInfo.tokenId);
        _userTokensByCollectionsDel(lotInfo.seller, lotInfo.collection, lotInfo.tokenId);
    }

    function deSellAll() public onlyOwner {
        for (uint256 i = 0; i < _marketTokens.length; i++) {
            SelledNFT memory lotInfo = _marketTokens[_marketTokens.length - i - 1];
            
            IERC721(lotInfo.collection).transferFrom(address(this), lotInfo.seller, lotInfo.tokenId);

            _userTokensDel(lotInfo.seller, lotInfo.collection, lotInfo.tokenId);
            _collectionTokensDel(lotInfo.collection, lotInfo.tokenId);
            _userTokensByCollectionsDel(lotInfo.seller, lotInfo.collection, lotInfo.tokenId);
        }
        delete _marketTokens;
    }
}
