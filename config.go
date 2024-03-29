package empirica

import (
	"github.com/empiricaly/empirica/internal/build"
	"github.com/empiricaly/empirica/internal/callbacks"
	"github.com/empiricaly/empirica/internal/player"
	"github.com/empiricaly/empirica/internal/server"
	"github.com/empiricaly/empirica/internal/settings"
	logger "github.com/empiricaly/empirica/internal/utils/log"
	"github.com/empiricaly/tajriba"
	jsoniter "github.com/json-iterator/go"
	"github.com/pkg/errors"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"
)

var json = jsoniter.ConfigCompatibleWithStandardLibrary

// Config is server configuration.
type Config struct {
	Name       string            `mapstructure:"name"`
	Server     *server.Config    `mapstructure:"server"`
	Player     *player.Config    `mapstructure:"player"`
	Callbacks  *callbacks.Config `mapstructure:"callbacks"`
	Tajriba    *tajriba.Config   `mapstructure:"tajriba"`
	Log        *logger.Config    `mapstructure:"log"`
	Production bool              `mapstructure:"production"`
}

// Validate configuration is ok.
func (c *Config) Validate() error {
	if err := c.Server.Validate(); err != nil {
		return errors.Wrap(err, "validate server configuration")
	}

	if err := c.Player.Validate(); err != nil {
		return errors.Wrap(err, "validate player configuration")
	}

	if err := c.Callbacks.Validate(); err != nil {
		return errors.Wrap(err, "validate callbacks configuration")
	}

	if err := c.Tajriba.Validate(); err != nil {
		return errors.Wrap(err, "validate tajriba configuration")
	}

	b, err := json.Marshal(build.Current())
	if err != nil {
		return errors.Wrap(err, "get build version")
	}

	c.Tajriba.Store.Metadata = b

	if err := c.Log.Validate(); err != nil {
		return errors.Wrap(err, "validate log configuration")
	}

	return nil
}

const DefaultStoreFile = settings.EmpiricaDir + "/local/tajriba.json"

// ConfigFlags helps configure cobra and viper flags.
func ConfigFlags(cmd *cobra.Command) error {
	if cmd == nil {
		return errors.New("command required")
	}

	if err := server.ConfigFlags(cmd, "server"); err != nil {
		return errors.Wrap(err, "set server configuration flags")
	}

	if err := player.ConfigFlags(cmd, "player"); err != nil {
		return errors.Wrap(err, "set player configuration flags")
	}

	if err := callbacks.ConfigFlags(cmd, "callbacks"); err != nil {
		return errors.Wrap(err, "set callbacks configuration flags")
	}

	if err := tajriba.ConfigFlags(cmd, "tajriba", DefaultStoreFile); err != nil {
		return errors.Wrap(err, "set tajriba configuration flags")
	}

	if err := logger.ConfigFlags(cmd, "log", "info"); err != nil {
		return errors.Wrap(err, "set logger configuration flags")
	}

	flag := "production"
	bval := false
	cmd.Flags().Bool(flag, bval, "Run in production mode")
	viper.SetDefault(flag, bval)

	flag = "name"
	sval := ""
	cmd.Flags().String(flag, sval, "Name of project")
	viper.SetDefault(flag, sval)
	if err := cmd.Flags().MarkHidden(flag); err != nil {
		return errors.Wrap(err, "mark name hidden")
	}

	return nil
}
